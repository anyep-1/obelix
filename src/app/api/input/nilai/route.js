import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromToken() {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Token tidak ditemukan");

  const { payload } = await jwtVerify(token, SECRET_KEY);
  return payload;
}

export async function POST(req) {
  try {
    const user = await getUserFromToken();
    const inputBy = user.email || user.username || user.id;

    const data = await req.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Data nilai tidak boleh kosong." },
        { status: 400 }
      );
    }

    const hasilSimpan = [];
    const skippedItems = [];

    for (const item of data) {
      const { nim, kode_matkul, nilai, clo, question } = item;

      // Cari mahasiswa
      const mahasiswa = await prisma.tb_mahasiswa.findFirst({
        where: { nim_mahasiswa: nim?.toString() },
      });
      if (!mahasiswa) {
        skippedItems.push({
          item,
          reason: `Mahasiswa dengan NIM ${nim} tidak ditemukan.`,
        });
        continue;
      }

      // Cari mata kuliah
      const matkul = await prisma.tb_matkul.findFirst({
        where: { kode_matkul },
      });
      if (!matkul) {
        skippedItems.push({
          item,
          reason: `Mata kuliah dengan kode ${kode_matkul} tidak ditemukan.`,
        });
        continue;
      }

      // Cari CLO
      const cloData = await prisma.tb_clo.findFirst({
        where: {
          nomor_clo: clo,
          matkul_id: matkul.matkul_id,
        },
      });
      if (!cloData) {
        skippedItems.push({
          item,
          reason: `CLO "${clo}" tidak ditemukan.`,
        });
        continue;
      }

      // Cari soal / question
      const soal = await prisma.tb_question.findFirst({
        where: {
          nama_question: question,
          clo_id: cloData.clo_id,
        },
      });
      if (!soal) {
        skippedItems.push({
          item,
          reason: `Question "${question}" tidak ditemukan.`,
        });
        continue;
      }

      // Simpan nilai
      const saved = await prisma.tb_nilai.create({
        data: {
          nilai_per_question: parseFloat(nilai),
          input_by: inputBy,
          question_id: soal.question_id,
          mahasiswa_id: mahasiswa.mahasiswa_id,
          clo_id: cloData.clo_id,
          matkul_id: matkul.matkul_id,
        },
      });

      hasilSimpan.push(saved);
    }

    if (hasilSimpan.length === 0) {
      return NextResponse.json(
        {
          error: "Tidak ada data nilai yang berhasil disimpan.",
          skipped: skippedItems.length,
          skippedItems,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Data nilai berhasil disimpan.",
        inserted: hasilSimpan.length,
        skipped: skippedItems.length,
        skippedItems,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menyimpan nilai:", error);
    return NextResponse.json(
      {
        error: error.message || "Terjadi kesalahan saat menyimpan data nilai.",
      },
      { status: 500 }
    );
  }
}
