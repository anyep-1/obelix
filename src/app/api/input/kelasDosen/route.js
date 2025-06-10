import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Handle POST request for adding kelas dosen
export async function POST(req) {
  try {
    const kelasDosenData = await req.json();

    // Validasi jika data kosong
    if (!kelasDosenData || kelasDosenData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data kelas dosen yang dikirim." },
        { status: 400 }
      );
    }

    const result = [];
    for (const kelasDosen of kelasDosenData) {
      try {
        const { tahun_akademik, kelas, nama_dosen, nama_matkul } = kelasDosen;

        // Cari dosen berdasarkan nama_dosen
        const dosen = await prisma.tb_dosen.findFirst({
          where: { nama_dosen },
        });

        if (!dosen) {
          console.error(`Dosen dengan nama ${nama_dosen} tidak ditemukan.`);
          throw new Error(`Dosen dengan nama ${nama_dosen} tidak ditemukan.`);
        }

        // Cari matkul berdasarkan nama_matkul
        const matkul = await prisma.tb_matkul.findFirst({
          where: { nama_matkul },
        });

        if (!matkul) {
          console.error(`Matkul dengan nama ${nama_matkul} tidak ditemukan.`);
          throw new Error(`Matkul dengan nama ${nama_matkul} tidak ditemukan.`);
        }

        // Tambahkan data kelas dosen ke database
        const createdKelasDosen = await prisma.tb_kelas_dosen.create({
          data: {
            tahun_akademik: String(tahun_akademik),
            kelas,
            dosen_id: dosen.dosen_id,
            matkul_id: matkul.matkul_id,
          },
        });

        result.push(createdKelasDosen);
      } catch (error) {
        console.error("Error memproses data:", kelasDosen, error.message);
        // Lanjutkan iterasi meskipun ada error
        result.push({ error: error.message, data: kelasDosen });
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating kelas dosen:", error.message);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan kelas dosen." },
      { status: 500 }
    );
  }
}
