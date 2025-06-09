export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    // Ambil data yang dipilih dari tb_selected_matkul
    const selectedData = await prisma.tb_selected_matkul.findMany({
      where: { selected: true },
      include: {
        tb_matkul: {
          include: {
            tb_clo: {
              include: {
                tb_plo: true, // PLO yang terkait
                tb_pi: true, // PI jika diperlukan
              },
            },
          },
        },
      },
    });

    // Ambil semua PLO yang ada
    const ploData = await prisma.tb_plo.findMany();

    // Strukturkan data untuk dikembalikan
    const responseData = selectedData.map((entry) => ({
      id: entry.tb_matkul?.matkul_id || null,
      nama: entry.tb_matkul?.nama_matkul || "Unknown",
      kode: entry.tb_matkul?.kode_matkul || "N/A",
      sks: entry.tb_matkul?.jumlah_sks || 0,
      tingkat: entry.tb_matkul?.tingkat || "Unknown",
      semester: entry.tb_matkul?.semester || "Unknown",
      clo:
        entry.tb_matkul?.tb_clo?.map((clo) => ({
          id: clo.clo_id,
          nama: clo.nama_clo,
          plo: clo.tb_plo
            ? {
                id: clo.tb_plo.plo_id,
                nama: clo.tb_plo.nama_plo,
              }
            : null,
          pi: clo.tb_pi
            ? {
                id: clo.tb_pi.pi_id,
                deskripsi: clo.tb_pi.deskripsi_pi,
                nomor: clo.tb_pi.nomor_pi,
              }
            : null,
        })) || [], // Pastikan ini array
    }));

    return new Response(
      JSON.stringify({ ploData, selectedData: responseData }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
