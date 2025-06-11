import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const toolsData = await req.json();

    if (!Array.isArray(toolsData) || toolsData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data tools yang dikirim." },
        { status: 400 }
      );
    }

    // Ambil semua tools eksisting untuk menghindari duplikasi
    const existingTools = await prisma.tb_tools_assessment.findMany({
      select: { nama_tools: true },
    });
    const existingSet = new Set(
      existingTools.map((t) => t.nama_tools.toLowerCase())
    );

    const toolsToInsert = [];
    const data_failed = [];

    for (const tool of toolsData) {
      const { nama_tools } = tool;

      if (!nama_tools || nama_tools.trim() === "") {
        data_failed.push({
          ...tool,
          error: "Nama tools tidak boleh kosong.",
        });
        continue;
      }

      if (existingSet.has(nama_tools.toLowerCase())) {
        data_failed.push({
          ...tool,
          error: `Tools '${nama_tools}' sudah ada.`,
        });
        continue;
      }

      toolsToInsert.push({ nama_tools });
      existingSet.add(nama_tools.toLowerCase()); // Tambahkan agar tidak duplikat dalam batch
    }

    let insertedCount = 0;
    if (toolsToInsert.length > 0) {
      const result = await prisma.tb_tools_assessment.createMany({
        data: toolsToInsert,
        skipDuplicates: true,
      });
      insertedCount = result.count;
    }

    return NextResponse.json(
      {
        message: "Proses input tools selesai.",
        inserted: insertedCount,
        skipped: data_failed.length,
        data_success: toolsToInsert,
        data_failed,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tools:", error);
    return NextResponse.json(
      {
        error: error.message || "Gagal menambahkan tools.",
      },
      { status: 500 }
    );
  }
}
