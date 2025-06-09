import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Handle GET request (Ambil CLO berdasarkan pi_id)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const piId = searchParams.get("pi_id");

    if (!piId) {
      // Jika tidak ada pi_id, kembalikan semua CLO
      const allClo = await prisma.tb_clo.findMany({
        include: {
          tb_matkul: true,
          tb_pi: true,
          tb_plo: {
            include: {
              tb_kurikulum: true,
            },
          },
        },
      });
      return NextResponse.json(allClo);
    }

    const piIdInt = parseInt(piId, 10);

    const clos = await prisma.tb_clo.findMany({
      where: {
        pi_id: piIdInt,
        tb_skor_clo: {
          some: {}, // CLO harus punya skor
        },
      },
      include: {
        tb_matkul: true,
        tb_skor_clo: true, // include skor supaya frontend bisa cek
        tb_pi: true,
        tb_plo: {
          include: {
            tb_kurikulum: true,
          },
        },
      },
    });

    return NextResponse.json(clos);
  } catch (error) {
    console.error("Error fetching CLO data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Handle POST request (Tambah CLO baru)
export async function POST(req) {
  try {
    const body = await req.json();
    const { namaClo, ploId, piId, matkulId, noUrut } = body;

    const newClo = await prisma.tb_clo.create({
      data: {
        nama_clo: namaClo,
        plo_id: ploId,
        pi_id: piId,
        matkul_id: matkulId,
        nomor_clo: noUrut,
      },
    });

    return NextResponse.json(newClo, { status: 201 });
  } catch (error) {
    console.error("Error creating CLO data:", error);
    return NextResponse.json(
      { error: "Failed to create data" },
      { status: 500 }
    );
  }
}

// Handle PUT request (Update CLO)
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cloId = searchParams.get("cloId");
    const body = await req.json();

    if (!cloId) {
      return NextResponse.json({ error: "cloId diperlukan" }, { status: 400 });
    }

    const updatedClo = await prisma.tb_clo.update({
      where: { clo_id: parseInt(cloId) },
      data: body,
    });

    return NextResponse.json(updatedClo);
  } catch (error) {
    console.error("Error updating CLO:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

// Handle DELETE request (Hapus CLO)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cloId = searchParams.get("cloId");

    if (!cloId) {
      return NextResponse.json({ error: "cloId diperlukan" }, { status: 400 });
    }

    await prisma.tb_clo.delete({
      where: { clo_id: parseInt(cloId) },
    });

    return NextResponse.json({ message: "CLO berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting CLO:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
