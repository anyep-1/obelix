import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req) => {
  try {
    const body = await req.json();

    const {
      kurikulum, // id dari frontend, misal: "5"
      matkul, // id
      plo, // id
      pi, // id
      ta_semester,
      dosen_pengampu, // array id dosen
      objek_pengukuran,
      kategori,
    } = body;

    // Cek apakah ID yg dikirim ada di database
    const kurikulumData = await prisma.tb_kurikulum.findUnique({
      where: { kurikulum_id: Number(kurikulum) },
    });
    if (!kurikulumData)
      return new Response(
        JSON.stringify({ message: "Kurikulum tidak ditemukan!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

    const matkulData = await prisma.tb_matkul.findUnique({
      where: { matkul_id: Number(matkul) },
    });
    if (!matkulData)
      return new Response(
        JSON.stringify({ message: "Mata Kuliah tidak ditemukan!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

    const ploData = await prisma.tb_plo.findUnique({
      where: { plo_id: Number(plo) },
    });
    if (!ploData)
      return new Response(JSON.stringify({ message: "PLO tidak ditemukan!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const piData = await prisma.tb_pi.findUnique({
      where: { pi_id: Number(pi) },
    });
    if (!piData)
      return new Response(JSON.stringify({ message: "PI tidak ditemukan!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    // Ambil nama dosen berdasarkan id yang dikirim dari frontend
    const dosenData = await prisma.tb_dosen.findMany({
      where: {
        dosen_id: { in: dosen_pengampu.map((id) => Number(id)) },
      },
      select: {
        nama_dosen: true,
      },
    });

    if (dosenData.length === 0) {
      return new Response(
        JSON.stringify({ message: "Dosen pengampu tidak ditemukan!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ambil array nama dosen saja
    const namaDosenArray = dosenData.map((d) => d.nama_dosen);

    // Convert kategori ke format JSON object sesuai kebutuhan
    const rubrikKategori = {};
    kategori.forEach((item) => {
      rubrikKategori[item.level.toLowerCase()] = {
        nilai: item.nilai,
        min: item.min,
        max: item.max,
        deskripsi: item.deskripsi,
      };
    });

    // Simpan data ke db
    const template = await prisma.tb_template_rubrik.create({
      data: {
        kurikulum_id: kurikulumData.kurikulum_id,
        matkul_id: matkulData.matkul_id,
        plo_id: ploData.plo_id,
        pi_id: piData.pi_id,
        ta_semester,
        dosen_pengampu: JSON.stringify(namaDosenArray), // simpan nama dosen, bukan id
        objek_pengukuran,
        rubrik_kategori: JSON.stringify(rubrikKategori),
      },
    });

    // Ambil data lengkap setelah disimpan
    const templateData = await prisma.tb_template_rubrik.findUnique({
      where: { template_id: template.template_id },
      include: {
        tb_kurikulum: true,
        tb_matkul: true,
        tb_plo: true,
        tb_pi: true,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Template berhasil disimpan!",
        template: templateData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saat menyimpan template rubrik:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal menyimpan template",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
