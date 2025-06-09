import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rubrikTemplates = await prisma.tb_template_rubrik.findMany({
      select: {
        template_id: true,
        matkul_id: true,
        tb_matkul: {
          select: { nama_matkul: true },
        },
        tb_skor_clo: {
          select: { id: true }, // hanya ambil id saja, untuk cek apakah ada
        },
        tb_plo: {
          select: {
            plo_id: true,
            nomor_plo: true,
          },
        },
      },
    });

    // Tambahkan flag `sudahGenerate`
    const withStatus = rubrikTemplates.map((item) => ({
      ...item,
      sudahGenerate: item.tb_skor_clo.length > 0,
    }));

    return NextResponse.json(withStatus);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data rubrik", error: error.message },
      { status: 500 }
    );
  }
}
