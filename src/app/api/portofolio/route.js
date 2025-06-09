import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const portofolioList = await prisma.tb_portofolio.findMany({
      include: {
        tb_matkul: {
          select: {
            matkul_id: true,
            nama_matkul: true,
          },
        },
        tb_kelas: {
          select: {
            kelas_id: true,
            kode_kelas: true,
          },
        },
        tb_kurikulum: {
          select: {
            kurikulum_id: true,
            tahun_kurikulum: true,
          },
        },
      },
    });

    return NextResponse.json(portofolioList);
  } catch (error) {
    console.error("Error fetching portofolio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
