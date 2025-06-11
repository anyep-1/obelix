import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const dosenData = await req.json();

    if (!dosenData || dosenData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data dosen yang dikirim." },
        { status: 400 }
      );
    }

    // Ambil semua kode dosen yang sudah ada
    const existing = await prisma.tb_dosen.findMany({
      select: { kode_dosen: true },
    });

    const existingKodeSet = new Set(existing.map((d) => d.kode_dosen));

    const toInsert = [];
    const skipped = [];

    for (const { nama_dosen, kode_dosen } of dosenData) {
      if (!nama_dosen || !kode_dosen) {
        skipped.push({ nama_dosen, kode_dosen, reason: "Data tidak lengkap." });
        continue;
      }

      if (existingKodeSet.has(kode_dosen)) {
        skipped.push({
          nama_dosen,
          kode_dosen,
          reason: `Kode dosen '${kode_dosen}' sudah ada.`,
        });
        continue;
      }

      toInsert.push({ nama_dosen, kode_dosen });
    }

    if (toInsert.length > 0) {
      await prisma.tb_dosen.createMany({
        data: toInsert,
        skipDuplicates: true, // jaga-jaga
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
    console.error("Error creating dosen:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan dosen." },
      { status: 500 }
    );
  }
}
