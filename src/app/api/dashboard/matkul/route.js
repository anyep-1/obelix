import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // pastikan ini path prisma kamu

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const total = await prisma.tb_matkul.count();
    return NextResponse.json({ total });
  } catch (error) {
    console.error("Error fetching total matkul:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
