// app/api/skor/pi/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { pi_id, skor } = await req.json();

    if (typeof pi_id !== "number" || typeof skor !== "number") {
      return NextResponse.json(
        { message: "Data tidak valid: pi_id dan skor harus angka" },
        { status: 400 }
      );
    }

    const saved = await prisma.tb_skor_pi.upsert({
      where: { pi_id }, // pastikan di schema pi_id @unique
      update: {
        skor,
        createdAt: new Date(),
      },
      create: {
        pi_id,
        skor,
      },
    });

    return NextResponse.json(
      { message: "Skor PI berhasil disimpan", data: saved },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menyimpan skor PI:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
