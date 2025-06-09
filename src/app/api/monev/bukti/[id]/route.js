import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const { id } = params;
  const { linkBukti } = await request.json();

  try {
    const monevId = parseInt(id);

    // Update linkBukti di tb_monev
    const updatedMonev = await prisma.tb_monev.update({
      where: { monev_id: monevId },
      data: {
        linkBukti,
        updated_at: new Date(),
      },
    });

    // Update semua RT yang berelasi ke monev ini → status = "dalam proses"
    await prisma.tb_rt.updateMany({
      where: { monev_id: monevId },
      data: { statusImplementasi: "Dalam proses" },
    });

    return NextResponse.json({ success: true, data: updatedMonev });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
