import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Handle POST request for adding dosen
export async function POST(req) {
  try {
    const dosenData = await req.json();

    // Validasi jika data kosong
    if (!dosenData || dosenData.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data dosen yang dikirim." },
        { status: 400 }
      );
    }

    // Proses setiap dosen dalam array
    const dosenPromises = dosenData.map(async (dosen) => {
      const { nama_dosen, kode_dosen } = dosen;

      // Cek apakah dosen sudah ada berdasarkan kode_dosen
      const existingDosen = await prisma.tb_dosen.findUnique({
        where: { kode_dosen },
      });

      if (existingDosen) {
        throw new Error(`Dosen dengan kode ${kode_dosen} sudah ada.`);
      }

      // Tambahkan dosen ke database
      return prisma.tb_dosen.create({
        data: {
          nama_dosen,
          kode_dosen,
        },
      });
    });

    // Tunggu semua dosen selesai diproses
    const result = await Promise.all(dosenPromises);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating dosen:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan dosen." },
      { status: 500 }
    );
  }
}
