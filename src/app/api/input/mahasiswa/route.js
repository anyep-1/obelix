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

    // Ambil semua kelas dan semua mahasiswa eksisting
    const [semuaKelas, semuaMahasiswa] = await Promise.all([
      prisma.tb_kelas.findMany({
        select: { kelas_id: true, kode_kelas: true },
      }),
      prisma.tb_mahasiswa.findMany({
        select: { nim_mahasiswa: true },
      }),
    ]);

    const kelasMap = new Map(semuaKelas.map((k) => [k.kode_kelas, k.kelas_id]));

    const existingNIM = new Set(semuaMahasiswa.map((m) => m.nim_mahasiswa));

    const tahunSekarang = new Date().getFullYear();

    const dataToInsert = [];
    const data_failed = [];

    for (const m of mahasiswaData) {
      const { nim, nama, kode_kelas } = m;
      const nimStr = String(nim);

      if (!nimStr || !nama || !kode_kelas) {
        data_failed.push({
          ...m,
          error: "Data tidak lengkap (NIM, Nama, atau Kelas kosong).",
        });
        continue;
      }

      if (existingNIM.has(nimStr)) {
        data_failed.push({
          ...m,
          error: `NIM '${nimStr}' sudah terdaftar.`,
        });
        continue;
      }

      const kelasId = kelasMap.get(kode_kelas);
      if (!kelasId) {
        data_failed.push({
          ...m,
          error: `Kelas '${kode_kelas}' tidak ditemukan.`,
        });
        continue;
      }

      dataToInsert.push({
        nim_mahasiswa: nimStr,
        nama_mahasiswa: nama,
        kelas_id: kelasId,
        enroll_year: tahunSekarang,
      });
    }

    let inserted = [];
    if (dataToInsert.length > 0) {
      inserted = await prisma.tb_mahasiswa.createMany({
        data: dataToInsert,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(
      {
        message: "Proses input mahasiswa selesai.",
        success: dataToInsert.length,
        failed: data_failed.length,
        data_success: dataToInsert,
        data_failed,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error utama saat input mahasiswa:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Terjadi kesalahan pada server saat memproses data mahasiswa.",
      },
      { status: 500 }
    );
  }
}
