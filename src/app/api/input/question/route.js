import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const questions = await req.json();

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data pertanyaan yang dikirim." },
        { status: 400 }
      );
    }

    const expectedKeys = ["nama_question", "clo", "tools", "nama_matkul"];
    const result = [];
    const skipped = [];

    for (const item of questions) {
      const missingKeys = expectedKeys.filter((key) => !(key in item));
      if (missingKeys.length > 0) {
        skipped.push({
          item,
          reason: `Kolom '${missingKeys.join(", ")}' tidak ditemukan.`,
        });
        continue;
      }

      const { nama_question, clo, tools, nama_matkul } = item;

      // Cari mata kuliah
      const matkulRecord = await prisma.tb_matkul.findFirst({
        where: { nama_matkul },
      });

      if (!matkulRecord) {
        skipped.push({
          item,
          reason: `Mata kuliah '${nama_matkul}' tidak ditemukan.`,
        });
        continue;
      }

      // Cari CLO
      const cloRecord = await prisma.tb_clo.findFirst({
        where: {
          nomor_clo: clo.toString(),
          matkul_id: matkulRecord.matkul_id,
        },
      });

      if (!cloRecord) {
        skipped.push({
          item,
          reason: `CLO nomor '${clo}' untuk matkul '${nama_matkul}' tidak ditemukan.`,
        });
        continue;
      }

      // Cari Tools
      const toolRecord = await prisma.tb_tools_assessment.findFirst({
        where: { nama_tools: tools },
      });

      if (!toolRecord) {
        skipped.push({
          item,
          reason: `Tools '${tools}' tidak ditemukan.`,
        });
        continue;
      }

      // Cek duplikat
      const existing = await prisma.tb_question.findFirst({
        where: {
          nama_question,
          clo_id: cloRecord.clo_id,
          tool_id: toolRecord.tool_id,
        },
      });

      if (existing) {
        skipped.push({
          item,
          reason: `Pertanyaan '${nama_question}' sudah ada.`,
        });
        continue;
      }

      // Simpan
      const saved = await prisma.tb_question.create({
        data: {
          nama_question,
          clo_id: cloRecord.clo_id,
          tool_id: toolRecord.tool_id,
        },
      });

      result.push(saved);
    }

    return NextResponse.json(
      {
        success: true,
        inserted: result.length,
        skipped: skipped.length,
        skippedItems: skipped,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menyimpan data pertanyaan:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menyimpan data." },
      { status: 500 }
    );
  }
}
