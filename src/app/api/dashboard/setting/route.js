import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const nilaiMin = await prisma.tb_nilai_minimum.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json({
      nilai_minimum: nilaiMin ? nilaiMin.nilai_minimum : 3.0,
    });
  } catch (error) {
    console.error("Error fetching nilai minimum:", error);
    return NextResponse.json(
      { error: "Gagal mengambil nilai minimum" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const nilai_minimum = parseFloat(body.nilai_minimum);

    if (isNaN(nilai_minimum) || nilai_minimum < 0 || nilai_minimum > 4) {
      return NextResponse.json(
        { error: "Nilai minimum harus angka antara 0 dan 4" },
        { status: 400 }
      );
    }

    const updated = await prisma.tb_nilai_minimum.update({
      where: { id: 1 },
      data: { nilai_minimum },
    });

    return NextResponse.json({
      message: "Nilai minimum berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating nilai minimum:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui nilai minimum" },
      { status: 500 }
    );
  }
}
