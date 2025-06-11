import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kurikulum = searchParams.get("kurikulum");
    const matkul = searchParams.get("matkul");

    // Ambil semua kurikulum
    if (!kurikulum && !matkul) {
      const kurikulums = await prisma.tb_kurikulum.findMany({
        select: {
          kurikulum_id: true,
          tahun_kurikulum: true,
        },
      });
      return Response.json({ kurikulum: kurikulums });
    }

    // Ambil mata kuliah berdasarkan kurikulum
    if (kurikulum && !matkul) {
      const matkuls = await prisma.tb_matkul.findMany({
        where: {
          tb_kurikulum: {
            tahun_kurikulum: kurikulum,
          },
        },
        select: {
          matkul_id: true,
          nama_matkul: true,
        },
      });
      return Response.json({ matkul: matkuls });
    }

    // Ambil PLO, PI, dan dosen berdasarkan matkul
    if (matkul) {
      const clos = await prisma.tb_clo.findMany({
        where: {
          tb_matkul: {
            nama_matkul: matkul,
          },
        },
        include: {
          tb_plo: {
            select: {
              plo_id: true,
              nomor_plo: true,
            },
          },
          tb_pi: {
            select: {
              pi_id: true,
              nomor_pi: true,
              plo_id: true,
            },
          },
        },
      });

      // Ambil PLO unik dan urutkan berdasarkan nomor_plo
      const uniquePloMap = new Map();
      clos.forEach((item) => {
        const plo = item.tb_plo;
        if (plo && !uniquePloMap.has(plo.plo_id)) {
          uniquePloMap.set(plo.plo_id, plo);
        }
      });
      const uniquePlo = Array.from(uniquePloMap.values()).sort(
        (a, b) => a.nomor_plo - b.nomor_plo
      );

      // Ambil PI unik dan urutkan berdasarkan nomor_pi
      const uniquePiMap = new Map();
      clos.forEach((item) => {
        const pi = item.tb_pi;
        if (pi && !uniquePiMap.has(pi.pi_id)) {
          uniquePiMap.set(pi.pi_id, pi);
        }
      });
      const uniquePi = Array.from(uniquePiMap.values()).sort(
        (a, b) => a.nomor_pi - b.nomor_pi
      );

      // Ambil dosen pengampu
      const dosens = await prisma.tb_kelas_dosen.findMany({
        where: {
          tb_matkul: {
            nama_matkul: matkul,
          },
        },
        include: {
          tb_dosen: {
            select: {
              dosen_id: true,
              nama_dosen: true,
            },
          },
        },
      });

      const uniqueDosenMap = new Map();
      dosens.forEach((item) => {
        const dosen = item.tb_dosen;
        if (dosen && !uniqueDosenMap.has(dosen.dosen_id)) {
          uniqueDosenMap.set(dosen.dosen_id, dosen);
        }
      });
      const uniqueDosen = Array.from(uniqueDosenMap.values());

      return Response.json({
        plo: uniquePlo,
        pi: uniquePi,
        dosen: uniqueDosen,
      });
    }

    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
