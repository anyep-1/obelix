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

    const createdMahasiswa = [];
    const failedMahasiswa = [];

    for (const mahasiswa of mahasiswaData) {
      const { nim, nama, kode_kelas } = mahasiswa;

      try {
        // Cari kelas berdasarkan kode_kelas
        const kelas = await prisma.tb_kelas.findUnique({
          where: { kode_kelas },
        });

        if (!kelas) {
          failedMahasiswa.push({
            nim,
            nama,
            kode_kelas,
            error: `Kelas '${kode_kelas}' tidak ditemukan.`,
          });
          continue;
        }

        // Cek apakah NIM sudah terdaftar
        const existing = await prisma.tb_mahasiswa.findUnique({
          where: { nim_mahasiswa: String(nim) },
        });

        if (existing) {
          failedMahasiswa.push({
            nim,
            nama,
            kode_kelas,
            error: `NIM '${nim}' sudah terdaftar.`,
          });
          continue;
        }

        // Simpan ke DB
        const created = await prisma.tb_mahasiswa.create({
          data: {
            nim_mahasiswa: String(nim),
            nama_mahasiswa: nama,
            kelas_id: kelas.kelas_id,
            enroll_year: new Date().getFullYear(),
          },
        });

        createdMahasiswa.push(created);
      } catch (err) {
        failedMahasiswa.push({
          nim,
          nama,
          kode_kelas,
          error: `Gagal menyimpan data: ${err.message}`,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Proses input mahasiswa selesai.",
        success: createdMahasiswa.length,
        failed: failedMahasiswa.length,
        data_success: createdMahasiswa,
        data_failed: failedMahasiswa,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error utama saat input mahasiswa:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat memproses data mahasiswa." },
      { status: 500 }
    );
  }
}
