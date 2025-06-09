import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kurikulum = searchParams.get("kurikulum");
    const matkul = searchParams.get("matkul");

    // Jika hanya membutuhkan kurikulum
    if (!kurikulum && !matkul) {
      const kurikulums = await prisma.tb_kurikulum.findMany({
        select: {
          kurikulum_id: true,
          tahun_kurikulum: true,
        },
      });
      return new Response(JSON.stringify({ kurikulum: kurikulums }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika kurikulum dipilih, ambil mata kuliah yang terkait
    if (kurikulum && !matkul) {
      const matkuls = await prisma.tb_matkul.findMany({
        where: { tb_kurikulum: { tahun_kurikulum: kurikulum } },
        select: {
          matkul_id: true,
          nama_matkul: true,
        },
      });
      return new Response(JSON.stringify({ matkul: matkuls }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika mata kuliah dipilih, ambil PLO, PI, dan dosen pengampu yang terkait
    if (matkul) {
      const clos = await prisma.tb_clo.findMany({
        where: { tb_matkul: { nama_matkul: matkul } },
        include: {
          tb_plo: { select: { plo_id: true, nomor_plo: true } },
          tb_pi: { select: { pi_id: true, nomor_pi: true } },
        },
      });

      // Ambil PLO dan PI unik
      const uniquePlo = Array.from(
        new Map(clos.map((item) => [item.tb_plo.plo_id, item.tb_plo])).values()
      );

      const uniquePi = Array.from(
        new Map(clos.map((item) => [item.tb_pi.pi_id, item.tb_pi])).values()
      );

      // Ambil dosen pengampu berdasarkan matkul
      const dosens = await prisma.tb_kelas_dosen.findMany({
        where: { tb_matkul: { nama_matkul: matkul } },
        include: {
          tb_dosen: { select: { dosen_id: true, nama_dosen: true } },
        },
      });

      // Ambil hanya informasi dosen
      const uniqueDosen = Array.from(
        new Map(
          dosens.map((item) => [item.tb_dosen.dosen_id, item.tb_dosen])
        ).values()
      );

      return new Response(
        JSON.stringify({
          plo: uniquePlo,
          pi: uniquePi,
          dosen: uniqueDosen,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
