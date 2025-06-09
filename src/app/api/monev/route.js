import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const data = await request.json();
    const { formData, rtData, userTujuanId, matkulId } = data;

    if (!userTujuanId) {
      return new Response(
        JSON.stringify({ error: "userTujuanId harus diisi" }),
        { status: 400 }
      );
    }

    // Ambil user pembuat dari JWT
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Token tidak valid" },
        { status: 401 }
      );
    }

    const userPembuatId = decoded.user_id;
    const userTujuanInt = parseInt(userTujuanId, 10);
    const matkulIdInt = parseInt(matkulId, 10);
    const userPembuatInt = parseInt(userPembuatId, 10);

    // Simpan data ke database
    const createdMonev = await prisma.tb_monev.create({
      data: {
        programStudi: formData.programStudi,
        tanggalRTM: new Date(formData.tanggalRTM),
        tanggalMonev: new Date(formData.tanggalMonev),
        evaluasiPeriode: formData.evaluasiPeriode,
        tujuanEvaluasi: formData.tujuanEvaluasi,
        metodeEvaluasi: formData.metodeEvaluasi,
        userTujuan: {
          connect: { user_id: userTujuanInt }, // sudah number
        },
        matkul: {
          connect: { matkul_id: matkulIdInt }, // sudah number
        },
        userPembuat: {
          connect: { user_id: userPembuatInt }, // sudah number
        },
        rtList: {
          create: rtData.map((rt) => ({
            deskripsiRT: rt.deskripsiRT,
            statusImplementasi: "Belum",
            tanggalMulai: rt.tanggalMulai ? new Date(rt.tanggalMulai) : null,
            tanggalSelesai: rt.tanggalSelesai
              ? new Date(rt.tanggalSelesai)
              : null,
            analisisKetercapaian: rt.analisisKetercapaian,
            kendala: rt.kendala,
            solusi: rt.solusi,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, monev: createdMonev });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const monevList = await prisma.tb_monev.findMany({
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
        matkul: true,
        rtList: true,
      },
      orderBy: {
        tanggalMonev: "desc",
      },
    });

    return NextResponse.json(monevList, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data monev:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data monev" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  try {
    // hapus dulu data dependensi
    await prisma.tb_rt.deleteMany({
      where: { monev_id: id },
    });

    // hapus data utama
    await prisma.tb_monev.delete({
      where: { monev_id: id },
    });

    return new Response(JSON.stringify({ message: "Berhasil dihapus" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gagal hapus monev:", error);
    return new Response(
      JSON.stringify({ error: "Gagal menghapus data monev" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
