import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Ambil semua monev dengan rtList
    const allMonev = await prisma.tb_monev.findMany({
      include: {
        rtList: {
          select: {
            statusImplementasi: true,
          },
        },
      },
    });

    let totalValidasi = 0;
    let totalPending = 0;

    allMonev.forEach((monev) => {
      const semuaSudah =
        monev.rtList.length > 0 &&
        monev.rtList.every((rt) => rt.statusImplementasi === "Sudah");

      if (semuaSudah) {
        totalValidasi++;
      } else {
        totalPending++;
      }
    });

    // Ambil 5 evaluasi terbaru
    const monevTerbaru = await prisma.tb_monev.findMany({
      select: {
        monev_id: true,
        created_at: true,
        matkul: {
          select: {
            nama_matkul: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
    });

    const evaluasiTerbaru = monevTerbaru.map((item) => ({
      id: `m-${item.monev_id}`,
      tanggal: item.created_at,
      matkul: item.matkul?.nama_matkul || "Tidak diketahui",
    }));

    return NextResponse.json({
      totalValidasi,
      totalPending,
      totalMonev: allMonev.length,
      evaluasiTerbaru,
    });
  } catch (error) {
    console.error("Gagal mengambil data summary:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
