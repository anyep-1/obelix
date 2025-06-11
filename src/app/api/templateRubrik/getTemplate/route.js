import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const templateId = url.searchParams.get("id");

    if (templateId) {
      // Ambil satu data berdasarkan template_id
      const template = await prisma.tb_template_rubrik.findUnique({
        where: { template_id: Number(templateId) },
        include: {
          tb_kurikulum: { select: { tahun_kurikulum: true } },
          tb_matkul: { select: { nama_matkul: true } },
          tb_plo: { select: { nama_plo: true } },
          tb_pi: {
            select: {
              deskripsi_pi: true,
              tb_clo: {
                select: {
                  nomor_clo: true,
                },
              },
            },
          },
        },
      });

      if (!template) {
        return new Response(
          JSON.stringify({ message: "Template tidak ditemukan!" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify(formatTemplate(template)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Ambil semua data
      let templates = await prisma.tb_template_rubrik.findMany({
        include: {
          tb_kurikulum: { select: { tahun_kurikulum: true } },
          tb_matkul: { select: { nama_matkul: true } },
          tb_plo: { select: { nama_plo: true } },
          tb_pi: {
            select: {
              deskripsi_pi: true,
              tb_clo: {
                select: {
                  nomor_clo: true,
                },
              },
            },
          },
        },
      });

      // Format data sebelum dikirim
      templates = templates.map(formatTemplate);

      return new Response(
        JSON.stringify({
          message: "Data template berhasil diambil",
          templates,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error saat mengambil data template:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal mengambil data template",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// Fungsi untuk memformat data sebelum dikirim
const formatTemplate = (template) => {
  // Parse rubrik_kategori sesuai struktur asli
  const parsedRubrik =
    typeof template.rubrik_kategori === "string"
      ? JSON.parse(template.rubrik_kategori)
      : template.rubrik_kategori;

  // Format ulang kategori ke bentuk array seperti input awal
  const kategori = Object.entries(parsedRubrik).map(([level, data]) => ({
    level: level.toUpperCase(),
    nilai: data.nilai,
    min: data.min,
    max: data.max,
    deskripsi: data.deskripsi,
  }));

  return {
    template_id: template.template_id,
    kurikulum: template.tb_kurikulum.tahun_kurikulum,
    matkul: template.tb_matkul.nama_matkul,
    plo: template.tb_plo.nama_plo,
    pi: template.tb_pi.deskripsi_pi,
    clo: template.tb_pi?.tb_clo?.map((clo) => clo.nomor_clo) || [],
    ta_semester: template.ta_semester,
    dosen_pengampu:
      typeof template.dosen_pengampu === "string"
        ? JSON.parse(template.dosen_pengampu)
        : template.dosen_pengampu,
    objek_pengukuran: template.objek_pengukuran,
    kategori,
    created_at: template.created_at,
    updated_at: template.updated_at,
  };
};
