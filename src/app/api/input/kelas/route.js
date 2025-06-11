import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data kelas yang dikirim." },
        { status: 400 }
      );
    }

    // Ambil semua kode_kelas yang sudah ada dari database
    const existingKelas = await prisma.tb_kelas.findMany({
      select: { kode_kelas: true },
    });

    const existingKodeSet = new Set(existingKelas.map((k) => k.kode_kelas));

    const toInsert = [];
    const skipped = [];

    for (const { kode_kelas } of data) {
      if (!kode_kelas) {
        skipped.push({ kode_kelas, reason: "Kode kelas tidak boleh kosong." });
        continue;
      }

      if (existingKodeSet.has(kode_kelas)) {
        skipped.push({
          kode_kelas,
          reason: `Kode kelas '${kode_kelas}' sudah ada.`,
        });
        continue;
      }

      toInsert.push({ kode_kelas });
    }

    if (toInsert.length > 0) {
      await prisma.tb_kelas.createMany({
        data: toInsert,
        skipDuplicates: true, // untuk jaga-jaga
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
    console.error("Error creating kelas:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan kelas." },
      { status: 500 }
    );
  }
}
