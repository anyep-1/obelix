import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { id } = params;

  try {
    const portofolio = await prisma.tb_portofolio.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        tb_matkul: {
          select: {
            nama_matkul: true,
          },
        },
        tb_kelas: {
          select: {
            kode_kelas: true,
          },
        },
        tb_kurikulum: {
          select: {
            tahun_kurikulum: true,
          },
        },
      },
    });

    if (!portofolio) {
      return NextResponse.json(
        { error: "Portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(portofolio);
  } catch (error) {
    console.error("Error fetching portofolio detail:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const id = Number(params.id);
  try {
    await prisma.tb_portofolio.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting portofolio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
