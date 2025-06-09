import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Handle POST request for adding Mahasiswa
export async function POST(req) {
  try {
    const mahasiswaData = await req.json();

    // Validasi jika data kosong
    if (!Array.isArray(mahasiswaData) || mahasiswaData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data mahasiswa yang dikirim." },
        { status: 400 }
      );
    }

    // Proses setiap mahasiswa dalam array
    const mahasiswaPromises = mahasiswaData.map(async (mahasiswa) => {
      const { nim, nama, kode_kelas } = mahasiswa;

      // Cari kelas berdasarkan kode_kelas
      const kelas = await prisma.tb_kelas.findUnique({
        where: { kode_kelas: kode_kelas },
      });

      if (!kelas) {
        throw new Error(`Kelas dengan kode ${kode_kelas} tidak ditemukan.`);
      }

      // Tambahkan kelas_id pada mahasiswa dan simpan
      return prisma.tb_mahasiswa.create({
        data: {
          nim_mahasiswa: String(nim), // Gunakan mahasiswa.nim
          nama_mahasiswa: nama,
          kelas_id: kelas.kelas_id, // Gunakan kelas_id yang ditemukan
          enroll_year: new Date().getFullYear(), // Tahun pendaftaran (bisa diubah sesuai kebutuhan)
        },
      });
    });

    // Tunggu semua mahasiswa selesai diproses
    const result = await Promise.all(mahasiswaPromises);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating mahasiswa:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan mahasiswa." },
      { status: 500 }
    );
  }
}
