import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle GET request
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ploId = searchParams.get("plo_id");

    const pi = await prisma.tb_pi.findMany({
      where: ploId ? { plo_id: parseInt(ploId, 10) } : {},
      include: {
        tb_plo: {
          include: {
            tb_kurikulum: true,
          },
        },
        tb_skor_pi: true,
      },
    });

    return NextResponse.json(pi);
  } catch (error) {
    console.error("Error fetching PI data:", error);
    return NextResponse.error(new Error("Failed to fetch data"));
  }
}

// Handle POST request
export async function POST(req) {
  try {
    const body = await req.json();
    const { deskripsiPi, ploId, no_urut } = body;

    if (!deskripsiPi || !ploId || isNaN(ploId)) {
      return NextResponse.json(
        { error: "Deskripsi PI dan PLO ID wajib diisi dengan benar!" },
        { status: 400 }
      );
    }

    const newPi = await prisma.tb_pi.create({
      data: {
        deskripsi_pi: deskripsiPi,
        plo_id: parseInt(ploId, 10),
        nomor_pi: no_urut,
      },
    });

    return NextResponse.json(newPi, { status: 201 });
  } catch (error) {
    console.error("Error creating PI data:", error);
    return NextResponse.json(
      { error: "Failed to create PI data" },
      { status: 500 }
    );
  }
}

// Handle PUT request (Edit PI)
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const piId = searchParams.get("piId");
    const body = await req.json();
    const { deskripsi_pi } = body;

    if (!piId || isNaN(piId) || !deskripsi_pi) {
      return NextResponse.json(
        { error: "ID dan deskripsi PI harus diberikan!" },
        { status: 400 }
      );
    }

    const updatedPi = await prisma.tb_pi.update({
      where: { pi_id: parseInt(piId, 10) },
      data: { deskripsi_pi },
    });

    return NextResponse.json(
      { message: "PI terkait berhasil diperbarui!", updatedPi },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating PI data:", error);
    return NextResponse.json(
      { error: "Failed to update PI data" },
      { status: 500 }
    );
  }
}

// Handle DELETE request
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const piId = searchParams.get("piId");

    if (!piId || isNaN(piId)) {
      return NextResponse.json(
        { error: "ID harus diberikan!" },
        { status: 400 }
      );
    }

    await prisma.tb_pi.delete({
      where: { pi_id: parseInt(piId, 10) },
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting PI data:", error);
    return NextResponse.json(
      { error: "Failed to delete PI data" },
      { status: 500 }
    );
  }
}
