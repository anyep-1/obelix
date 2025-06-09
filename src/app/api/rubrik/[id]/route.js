import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fungsi untuk mencari kategori berdasarkan skor dan rubrik
function cariKategori(skor, rubrikKategori) {
  for (const [namaKategori, info] of Object.entries(rubrikKategori)) {
    if (skor >= info.min && skor <= info.max) {
      return namaKategori.toUpperCase(); // Semua huruf besar agar konsisten di frontend
    }
  }
  return "TIDAK DIKETAHUI"; // Jika tidak ada kategori yang sesuai
}

export async function GET(req, { params }) {
  const templateId = parseInt(params.id, 10);

  // Ambil template rubrik dan relasi terkait
  const template = await prisma.tb_template_rubrik.findUnique({
    where: { template_id: templateId },
    include: {
      tb_matkul: { select: { nama_matkul: true } },
      tb_plo: { select: { nama_plo: true, nomor_plo: true } },
      tb_pi: {
        select: {
          deskripsi_pi: true,
          tb_clo: { select: { clo_id: true, nama_clo: true } },
        },
      },
      tb_skor_clo: true,
    },
  });

  if (!template) {
    return NextResponse.json(
      { error: "Rubrik tidak ditemukan" },
      { status: 404 }
    );
  }

  // Parsing rubrik kategori (dari string JSON atau objek)
  const rubrikKategori =
    typeof template.rubrik_kategori === "string"
      ? JSON.parse(template.rubrik_kategori)
      : template.rubrik_kategori;

  // Ambil semua clo_id dari tb_pi.tb_clo
  const cloIds = template.tb_pi.tb_clo.map((c) => c.clo_id);

  // Ambil nilai mahasiswa dari tb_nilai sesuai cloIds
  const nilaiMahasiswa = await prisma.tb_nilai.findMany({
    where: { clo_id: { in: cloIds } },
    select: { nilai_per_question: true },
  });

  // Hitung kategori berdasarkan nilai mahasiswa
  const kategoriCount = {
    EXEMPLARY: 0,
    SATISFACTORY: 0,
    DEVELOPING: 0,
    UNSATISFACTORY: 0,
    TIDAK_DIKETAHUI: 0,
  };

  nilaiMahasiswa.forEach(({ nilai_per_question }) => {
    const kategori = cariKategori(nilai_per_question, rubrikKategori);
    if (kategoriCount[kategori] !== undefined) {
      kategoriCount[kategori]++;
    } else {
      kategoriCount.TIDAK_DIKETAHUI++;
    }
  });

  const jumlahMahasiswa = nilaiMahasiswa.length;

  // Buat data semuaNilai dari tb_skor_clo (skor CLO ringkasan)
  const semuaNilai = template.tb_skor_clo.map((item) => ({
    nilai_per_question: item.skor,
    kategori: cariKategori(item.skor, rubrikKategori),
  }));

  // Kirimkan response lengkap
  return NextResponse.json({
    template,
    semuaNilai,
    kategoriCount,
    jumlahMahasiswa,
  });
}

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID rubrik tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const deletedRubrik = await prisma.tb_template_rubrik.delete({
      where: { template_id: Number(id) },
    });

    return NextResponse.json({
      message: "Rubrik berhasil dihapus",
      data: deletedRubrik,
    });
  } catch (error) {
    console.error("Error menghapus rubrik:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Rubrik tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Gagal menghapus rubrik" },
      { status: 500 }
    );
  }
}
