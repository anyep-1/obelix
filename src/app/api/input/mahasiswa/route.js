import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const mahasiswaData = await req.json();

    if (!Array.isArray(mahasiswaData) || mahasiswaData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data mahasiswa yang dikirim." },
        { status: 400 }
      );
    }

    const prosesSemuaMahasiswa = mahasiswaData.map(async (mahasiswa) => {
      const { nim, nama, kode_kelas } = mahasiswa;

      try {
        const kelas = await prisma.tb_kelas.findUnique({
          where: { kode_kelas },
        });

        if (!kelas) {
          throw new Error(`Kelas '${kode_kelas}' tidak ditemukan.`);
        }

        const existing = await prisma.tb_mahasiswa.findUnique({
          where: { nim_mahasiswa: String(nim) },
        });

        if (existing) {
          throw new Error(`NIM '${nim}' sudah terdaftar.`);
        }

        const created = await prisma.tb_mahasiswa.create({
          data: {
            nim_mahasiswa: String(nim),
            nama_mahasiswa: nama,
            kelas_id: kelas.kelas_id,
            enroll_year: new Date().getFullYear(),
          },
        });

        return { success: true, data: created };
      } catch (err) {
        return {
          success: false,
          data: {
            nim,
            nama,
            kode_kelas,
            error: err.message,
          },
        };
      }
    });

    // Jalankan semua secara paralel
    const results = await Promise.allSettled(prosesSemuaMahasiswa);

    const data_success = results
      .filter((r) => r.status === "fulfilled" && r.value.success)
      .map((r) => r.value.data);

    const data_failed = results
      .filter((r) => r.status === "fulfilled" && !r.value.success)
      .map((r) => r.value.data);

    return NextResponse.json(
      {
        message: "Proses input mahasiswa selesai.",
        success: data_success.length,
        failed: data_failed.length,
        data_success,
        data_failed,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error utama saat input mahasiswa:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server saat memproses data mahasiswa.",
      },
      { status: 500 }
    );
  }
}
