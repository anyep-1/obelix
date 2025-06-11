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
    const skipped = [];
    const toInsert = [];

    // Ambil semua data pendukung
    const [allMatkul, allClo, allTools, allExisting] = await Promise.all([
      prisma.tb_matkul.findMany(),
      prisma.tb_clo.findMany(),
      prisma.tb_tools_assessment.findMany(),
      prisma.tb_question.findMany({
        select: {
          nama_question: true,
          clo_id: true,
          tool_id: true,
        },
      }),
    ]);

    // Buat peta untuk lookup cepat
    const matkulMap = new Map(allMatkul.map((m) => [m.nama_matkul, m]));
    const cloMap = new Map(
      allClo.map((c) => [`${c.matkul_id}_${c.nomor_clo}`, c])
    );
    const toolsMap = new Map(allTools.map((t) => [t.nama_tools, t]));
    const existingSet = new Set(
      allExisting.map((e) => `${e.nama_question}_${e.clo_id}_${e.tool_id}`)
    );

    for (const item of questions) {
      const missing = expectedKeys.filter((key) => !(key in item));
      if (missing.length > 0) {
        skipped.push({
          item,
          reason: `Kolom '${missing.join(", ")}' tidak ditemukan.`,
        });
        continue;
      }

      const { nama_question, clo, tools, nama_matkul } = item;

      const matkul = matkulMap.get(nama_matkul);
      if (!matkul) {
        skipped.push({
          item,
          reason: `Mata kuliah '${nama_matkul}' tidak ditemukan.`,
        });
        continue;
      }

      const cloObj = cloMap.get(`${matkul.matkul_id}_${clo}`);
      if (!cloObj) {
        skipped.push({
          item,
          reason: `CLO '${clo}' untuk matkul '${nama_matkul}' tidak ditemukan.`,
        });
        continue;
      }

      const toolObj = toolsMap.get(tools);
      if (!toolObj) {
        skipped.push({ item, reason: `Tools '${tools}' tidak ditemukan.` });
        continue;
      }

      const key = `${nama_question}_${cloObj.clo_id}_${toolObj.tool_id}`;
      if (existingSet.has(key)) {
        skipped.push({
          item,
          reason: `Pertanyaan '${nama_question}' sudah ada.`,
        });
        continue;
      }

      toInsert.push({
        nama_question,
        clo_id: cloObj.clo_id,
        tool_id: toolObj.tool_id,
      });
    }

    // Simpan sekaligus
    if (toInsert.length > 0) {
      await prisma.tb_question.createMany({
        data: toInsert,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(
      {
        success: true,
        inserted: toInsert.length,
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
