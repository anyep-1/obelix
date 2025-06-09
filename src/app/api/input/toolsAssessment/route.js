import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST request for adding tools
export async function POST(req) {
  try {
    const toolsData = await req.json();

    // Validasi jika data kosong
    if (!toolsData || toolsData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data tools yang dikirim." },
        { status: 400 }
      );
    }

    // Proses setiap tools dalam array
    const toolsPromises = toolsData.map(async (tool) => {
      const { nama_tools } = tool;

      // Tambahkan tools ke database
      return prisma.tb_tools_assessment.create({
        data: {
          nama_tools,
        },
      });
    });

    // Tunggu semua tools selesai diproses
    const result = await Promise.all(toolsPromises);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating tools:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan tools." },
      { status: 500 }
    );
  }
}
