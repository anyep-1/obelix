import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle GET request dengan filter opsional berdasarkan kurikulumId
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kurikulumId = searchParams.get("kurikulumId");

    const matkul = await prisma.tb_matkul.findMany({
      where: kurikulumId ? { kurikulum_id: Number(kurikulumId) } : {},
      include: {
        tb_kurikulum: true,
      },
    });

    return NextResponse.json(matkul);
  } catch (error) {
    console.error("Error fetching matkul data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Handle POST request untuk menambahkan mata kuliah baru
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      namaMatkul,
      kodeMatkul,
      jumlahSKS,
      kurikulumId,
      tingkat,
      semester,
    } = body;

    if (
      !namaMatkul ||
      !kodeMatkul ||
      !jumlahSKS ||
      !kurikulumId ||
      !tingkat ||
      !semester
    ) {
      return NextResponse.json(
        { message: "Semua field harus diisi!" },
        { status: 400 }
      );
    }

    const newMatkul = await prisma.tb_matkul.create({
      data: {
        nama_matkul: namaMatkul,
        kode_matkul: kodeMatkul,
        jumlah_sks: jumlahSKS,
        kurikulum_id: kurikulumId,
        tingkat,
        semester,
      },
    });

    return NextResponse.json(newMatkul, { status: 201 });
  } catch (error) {
    console.error("Error creating matkul data:", error);
    return NextResponse.json(
      { message: "Failed to create data" },
      { status: 500 }
    );
  }
}

// Handle PUT request untuk memperbarui data mata kuliah berdasarkan ID
export async function PUT(req) {
  try {
    // Ambil ID dari URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    // Pastikan ID ada dan valid
    if (!id || isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid!" }, { status: 400 });
    }

    // Konversi ID ke angka
    const matkulId = Number(id);

    // Ambil data dari body request
    const body = await req.json();
    const { namaMatkul, kodeMatkul, jumlahSKS, tingkat, semester } = body;

    if (!namaMatkul || !kodeMatkul || !jumlahSKS || !tingkat || !semester) {
      return NextResponse.json(
        { message: "Semua field harus diisi!" },
        { status: 400 }
      );
    }

    // Update data di database
    const updatedMatkul = await prisma.tb_matkul.update({
      where: { matkul_id: matkulId }, // Sesuaikan dengan nama kolom ID di database
      data: {
        nama_matkul: namaMatkul,
        kode_matkul: kodeMatkul,
        jumlah_sks: jumlahSKS,
        tingkat,
        semester,
      },
    });

    return NextResponse.json(updatedMatkul);
  } catch (error) {
    console.error("Error updating matkul data:", error);
    return NextResponse.json(
      { message: "Failed to update data" },
      { status: 500 }
    );
  }
}

// Handle DELETE request untuk menghapus mata kuliah berdasarkan ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("matkulId"); // Ambil dari query parameter

    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID tidak valid" }), {
        status: 400,
      });
    }

    const deletedMatkul = await prisma.tb_matkul.delete({
      where: { matkul_id: parseInt(id) }, // Gunakan `matkul_id` sesuai skema
    });

    return new Response(
      JSON.stringify({ message: "Data berhasil dihapus", deletedMatkul }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting matkul data:", error);
    return new Response(JSON.stringify({ error: "Gagal menghapus data" }), {
      status: 500,
    });
  }
}
