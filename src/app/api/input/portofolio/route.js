import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const {
    kurikulum_id,
    tahun_akademik,
    matkul_id,
    kelas_id,
    google_drive_link,
  } = body;

  try {
    const created = await prisma.tb_portofolio.create({
      data: {
        kurikulum_id: Number(kurikulum_id), // pastikan tipe number
        tahun_akademik,
        matkul_id: Number(matkul_id),
        kelas_id: Number(kelas_id),
        link_drive: google_drive_link || null, // optional, bisa null
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating portofolio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
