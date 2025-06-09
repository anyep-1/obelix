import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const monevList = await prisma.tb_monev.findMany({
      include: {
        matkul: {
          select: {
            matkul_id: true,
            nama_matkul: true,
          },
        },
        userTujuan: {
          select: {
            user_id: true,
            nama: true,
          },
        },
        rtList: {
          select: {
            statusImplementasi: true,
          },
        },
      },
      orderBy: {
        tanggalMonev: "desc",
      },
    });

    // Filter hanya data yang punya relasi matkul
    const matkulWithData = monevList.filter((item) => item.matkul !== null);

    return NextResponse.json(matkulWithData, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil mata kuliah dengan data monev:", error);
    return NextResponse.json(
      { message: "Gagal mengambil mata kuliah" },
      { status: 500 }
    );
  }
}
