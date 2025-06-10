import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const selectedData = await prisma.tb_selected_matkul.findMany({
      where: {
        selected: true,
      },
      include: {
        tb_matkul: {
          include: {
            tb_clo: {
              include: {
                tb_pi: true,
                tb_plo: true,
              },
            },
          },
        },
        tb_plo: true,
      },
    });

    const grouped = new Map();

    selectedData.forEach((entry) => {
      const plo = entry.tb_plo;
      const matkul = entry.tb_matkul;

      if (!plo || !matkul) return;

      if (!grouped.has(plo.plo_id)) {
        grouped.set(plo.plo_id, {
          plo_id: plo.plo_id,
          nomor_plo: plo.nomor_plo,
          nama_plo: plo.nama_plo,
          matkul: [],
        });
      }

      const group = grouped.get(plo.plo_id);
      group.matkul.push({
        id: matkul.matkul_id,
        nama: matkul.nama_matkul,
        kode: matkul.kode_matkul,
        jumlah_sks: matkul.jumlah_sks,
        tingkat: matkul.tingkat,
        semester: matkul.semester,
        clo:
          matkul.tb_clo?.map((clo) => ({
            id: clo.clo_id,
            deskripsi: clo.nama_clo,
            pi: clo.tb_pi
              ? {
                  id: clo.tb_pi.pi_id,
                  nomor: clo.tb_pi.nomor_pi,
                  deskripsi: clo.tb_pi.deskripsi_pi,
                  plo_id: clo.tb_pi.plo_id,
                }
              : null,
            plo: clo.tb_plo
              ? {
                  id: clo.tb_plo.plo_id,
                  nomor: clo.tb_plo.nomor_plo,
                  nama: clo.tb_plo.nama_plo,
                }
              : null,
          })) || [],
      });
    });

    return new Response(
      JSON.stringify({ data: Array.from(grouped.values()) }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saat mengambil data assessment hasil:", error);
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data assessment hasil" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
