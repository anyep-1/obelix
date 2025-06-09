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
  return payload; // ini bisa berisi email, id, role, dsb
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

    for (const item of data) {
      const { nim, kode_matkul, nilai, clo, question } = item;

      const mahasiswa = await prisma.tb_mahasiswa.findFirst({
        where: { nim_mahasiswa: nim.toString() },
      });

      if (!mahasiswa) {
        console.warn(`Mahasiswa dengan NIM ${nim} tidak ditemukan.`);
        continue;
      }

      const matkul = await prisma.tb_matkul.findFirst({
        where: { kode_matkul },
      });
      if (!matkul) {
        console.warn(`Matkul dengan kode ${kode_matkul} tidak ditemukan.`);
        continue;
      }

      const cloData = await prisma.tb_clo.findFirst({
        where: {
          nomor_clo: clo,
          matkul_id: matkul.matkul_id,
        },
      });
      if (!cloData) {
        console.warn(`CLO "${clo}" tidak ditemukan.`);
        continue;
      }

      const soal = await prisma.tb_question.findFirst({
        where: {
          nama_question: question,
          clo_id: cloData.clo_id,
        },
      });
      if (!soal) {
        console.warn(`Question "${question}" tidak ditemukan.`);
        continue;
      }

      const saved = await prisma.tb_nilai.create({
        data: {
          nilai_per_question: parseFloat(nilai),
          input_by: inputBy, // ← dari token JWT
          question_id: soal.question_id,
          mahasiswa_id: mahasiswa.mahasiswa_id,
          clo_id: cloData.clo_id,
          matkul_id: matkul.matkul_id,
        },
      });

      hasilSimpan.push(saved);
    }

    return NextResponse.json(
      { message: "Data nilai berhasil disimpan", saved: hasilSimpan },
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
