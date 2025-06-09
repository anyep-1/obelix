import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Handle GET request
export async function GET() {
  try {
    const kurikulum = await prisma.tb_kurikulum.findMany(); // Mengambil data kurikulum
    return NextResponse.json(kurikulum);
  } catch (error) {
    console.error("Error fetching kurikulum data:", error);
    return NextResponse.error(new Error("Failed to fetch kurikulum data"));
  }
}

export async function POST() {
  try {
    const body = await req.json();
    const { tahunKurikulum } = body;

    const newTahun = await prisma.tb_kurikulum.create({
      data: {
        tahun_kurikulum: tahunKurikulum,
      },
    });
    return NextResponse.json(newTahun, { status: 201 });
  } catch (error) {
    console.error("Error creating matkul data:", error);
    return NextResponse.error(new Error("Failed to create data"));
  }
}
