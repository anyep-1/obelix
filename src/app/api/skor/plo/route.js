// app/api/skor/plo/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { plo_id, skor } = await req.json();

    // Validate
    if (typeof plo_id !== "number" || typeof skor !== "number") {
      return NextResponse.json(
        { message: "Field plo_id dan skor wajib numeric" },
        { status: 400 }
      );
    }

    // Upsert: update jika sudah ada, buat baru jika belum
    const saved = await prisma.tb_skor_plo.upsert({
      where: { plo_id }, // plo_id harus unique di model
      update: {
        skor,
        createdAt: new Date(),
      },
      create: {
        plo_id,
        skor,
      },
    });

    return NextResponse.json(
      { message: "Skor PLO berhasil disimpan", data: saved },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menyimpan skor PLO:", error);
    return NextResponse.json(
      { message: "Error internal server" },
      { status: 500 }
    );
  }
}

// Jangan lupa juga handle OPTIONS jika perlu CORS/preflight:
export async function OPTIONS() {
  return NextResponse.json(
    {},
    { status: 204, headers: { Allow: "POST,OPTIONS" } }
  );
}
