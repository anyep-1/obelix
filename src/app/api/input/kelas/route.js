import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle POST request for adding Kelas
export async function POST(req) {
  try {
    const data = await req.json();

    // Validasi jika data kosong
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data kelas yang dikirim." },
        { status: 400 }
      );
    }

    // Proses setiap kelas dalam array
    const kelasPromises = data.map(async (item) => {
      const { kode_kelas } = item;

      // Validasi jika kode_kelas kosong
      if (!kode_kelas) {
        throw new Error("Kode Kelas tidak boleh kosong.");
      }

      // Cek apakah kelas dengan kode_kelas yang sama sudah ada
      const existingKelas = await prisma.tb_kelas.findUnique({
        where: { kode_kelas: kode_kelas },
      });

      if (existingKelas) {
        throw new Error(`Kelas dengan kode ${kode_kelas} sudah ada.`);
      }

      // Jika kelas belum ada, buat kelas baru
      return prisma.tb_kelas.create({
        data: {
          kode_kelas: kode_kelas,
        },
      });
    });

    // Tunggu semua kelas selesai diproses
    const result = await Promise.all(kelasPromises);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating kelas:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan kelas." },
      { status: 500 }
    );
  }
}
