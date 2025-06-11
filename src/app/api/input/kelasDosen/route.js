import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const kelasDosenData = await req.json();

    if (!kelasDosenData || kelasDosenData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data kelas dosen yang dikirim." },
        { status: 400 }
      );
    }

    // Ambil semua dosen & matkul dari DB
    const [allDosen, allMatkul] = await Promise.all([
      prisma.tb_dosen.findMany({
        select: { dosen_id: true, nama_dosen: true },
      }),
      prisma.tb_matkul.findMany({
        select: { matkul_id: true, nama_matkul: true },
      }),
    ]);

    // Buat Map untuk pencarian cepat
    const dosenMap = new Map(allDosen.map((d) => [d.nama_dosen, d.dosen_id]));
    const matkulMap = new Map(
      allMatkul.map((m) => [m.nama_matkul, m.matkul_id])
    );

    const toInsert = [];
    const skipped = [];

    for (const item of kelasDosenData) {
      const { tahun_akademik, kelas, nama_dosen, nama_matkul } = item;

      const dosen_id = dosenMap.get(nama_dosen);
      const matkul_id = matkulMap.get(nama_matkul);

      if (!dosen_id) {
        skipped.push({
          item,
          reason: `Dosen '${nama_dosen}' tidak ditemukan.`,
        });
        continue;
      }

      if (!matkul_id) {
        skipped.push({
          item,
          reason: `Matkul '${nama_matkul}' tidak ditemukan.`,
        });
        continue;
      }

      if (!tahun_akademik || !kelas) {
        skipped.push({
          item,
          reason: `Data tidak lengkap (tahun_akademik / kelas kosong).`,
        });
        continue;
      }

      toInsert.push({
        tahun_akademik: String(tahun_akademik),
        kelas,
        dosen_id,
        matkul_id,
      });
    }

    if (toInsert.length > 0) {
      await prisma.tb_kelas_dosen.createMany({
        data: toInsert,
        skipDuplicates: true, // hindari error kalau sudah ada
      });
    }

    return NextResponse.json(
      {
        success: true,
        inserted: toInsert.length,
        skipped: skipped.length,
        skippedItems: skipped,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating kelas dosen:", error.message);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan kelas dosen." },
      { status: 500 }
    );
  }
}
