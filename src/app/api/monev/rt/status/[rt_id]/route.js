import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // pastikan path sesuai

export async function PATCH(request, { params }) {
  try {
    const { rt_id } = params;
    const { status } = await request.json();

    if (!["Sudah", "Ditolak"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status invalid" },
        { status: 400 }
      );
    }

    await prisma.tb_rt.update({
      where: { rt_id: Number(rt_id) },
      data: { statusImplementasi: status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
