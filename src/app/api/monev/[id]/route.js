import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_, { params }) {
  const { id } = params;

  try {
    const monevList = await prisma.tb_monev.findMany({
      where: {
        matkul_id: parseInt(id),
      },
      include: {
        userTujuan: {
          select: {
            user_id: true,
            nama: true,
            role: true,
          },
        },
        userPembuat: {
          select: {
            user_id: true,
            nama: true,
            role: true,
          },
        },
        matkul: {
          select: {
            matkul_id: true,
            nama_matkul: true,
          },
        },
        rtList: true,
      },
      orderBy: {
        tanggalMonev: "desc",
      },
    });

    return NextResponse.json(monevList);
  } catch (error) {
    console.error("Gagal mengambil data monev:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data monev" },
      { status: 500 }
    );
  }
}
