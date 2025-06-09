import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kelas = await prisma.tb_kelas.findMany(); // ambil semua data kelas
    return NextResponse.json(kelas);
  } catch (error) {
    console.error("Error fetching kelas data:", error);
    return NextResponse.error(new Error("Failed to fetch kelas data"));
  }
}
