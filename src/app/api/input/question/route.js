import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    for (const item of questions) {
      for (const key of expectedKeys) {
        if (!(key in item)) {
          return NextResponse.json(
            { error: `Kolom '${key}' tidak ditemukan pada salah satu baris.` },
            { status: 400 }
          );
        }
      }
    }

    const result = [];

    for (const item of questions) {
      const { nama_question, clo, tools, nama_matkul } = item;

      // Cari mata kuliah berdasarkan nama_matkul
      const matkulRecord = await prisma.tb_matkul.findFirst({
        where: { nama_matkul: nama_matkul },
      });

      if (!matkulRecord) {
        return NextResponse.json(
          { error: `Mata kuliah '${nama_matkul}' tidak ditemukan.` },
          { status: 400 }
        );
      }

      // Cari CLO berdasarkan nomor_clo dan matkul_id
      const cloRecord = await prisma.tb_clo.findFirst({
        where: {
          nomor_clo: clo.toString(),
          matkul_id: matkulRecord.matkul_id,
        },
      });

      if (!cloRecord) {
        return NextResponse.json(
          {
            error: `CLO nomor '${clo}' untuk mata kuliah '${nama_matkul}' tidak ditemukan.`,
          },
          { status: 400 }
        );
      }

      // Cari tools berdasarkan nama_tools
      const toolRecord = await prisma.tb_tools_assessment.findFirst({
        where: { nama_tools: tools },
      });

      if (!toolRecord) {
        return NextResponse.json(
          { error: `Tool '${tools}' tidak ditemukan.` },
          { status: 400 }
        );
      }

      // Cek duplikat pertanyaan
      const existingQuestion = await prisma.tb_question.findFirst({
        where: {
          nama_question,
          clo_id: cloRecord.clo_id,
          tool_id: toolRecord.tool_id,
        },
      });

      if (existingQuestion) {
        console.log(`Pertanyaan '${nama_question}' sudah ada. Melewati...`);
        continue; // lewati jika sudah ada
      }

      // Simpan pertanyaan baru
      const saved = await prisma.tb_question.create({
        data: {
          nama_question,
          clo_id: cloRecord.clo_id,
          tool_id: toolRecord.tool_id,
        },
      });

      result.push(saved);
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan data pertanyaan:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menyimpan data." },
      { status: 500 }
    );
  }
}
