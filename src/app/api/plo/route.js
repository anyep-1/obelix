import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Handle POST request
export async function POST(req) {
  const { namaPLO, kurikulumId, no_urut } = await req.json();

  try {
    const plo = await prisma.tb_plo.create({
      data: {
        nama_plo: namaPLO,
        kurikulum_id: kurikulumId,
        nomor_plo: no_urut,
      },
    });
    return new Response(JSON.stringify(plo), { status: 201 });
  } catch (error) {
    console.error("Error saving PLO:", error);
    return new Response(JSON.stringify({ error: "Error saving PLO" }), {
      status: 500,
    });
  }
}

// Handle GET request with optional kurikulumId query parameter
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kurikulumId = searchParams.get("kurikulumId");

    let plos;
    if (kurikulumId) {
      plos = await prisma.tb_plo.findMany({
        where: { kurikulum_id: Number(kurikulumId) },
      });
    } else {
      plos = await prisma.tb_plo.findMany();
    }

    return new Response(JSON.stringify(plos), { status: 200 });
  } catch (error) {
    console.error("Error fetching PLOs:", error);
    return new Response(JSON.stringify({ error: "Error fetching PLOs" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ploId = searchParams.get("ploId");
    const body = await req.json();
    const { namaPLO } = body;

    if (!ploId || !namaPLO) {
      return NextResponse.json(
        { error: "PLO ID dan namaPLO wajib diisi!" },
        { status: 400 }
      );
    }

    // Mengupdate data di tb_plo
    const updatedPLO = await prisma.tb_plo.update({
      where: { plo_id: parseInt(ploId, 10) },
      data: { nama_plo: namaPLO },
    });

    // Anda bisa menambahkan update untuk tabel lain yang berelasi, jika diperlukan

    return NextResponse.json(
      { message: "PLO dan data terkait berhasil diperbarui!", updatedPLO },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating PLO:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui PLO" },
      { status: 500 }
    );
  }
}

// Handle DELETE request untuk menghapus PLO
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ploId = searchParams.get("ploId");

    if (!ploId) {
      return NextResponse.json(
        { error: "PLO ID wajib diisi!" },
        { status: 400 }
      );
    }

    // Mengonversi ploId ke integer
    const ploIdInt = parseInt(ploId, 10);

    // Pastikan ploId adalah angka yang valid
    if (isNaN(ploIdInt)) {
      return NextResponse.json(
        { error: "PLO ID tidak valid!" },
        { status: 400 }
      );
    }

    // Menghapus data terkait terlebih dahulu (secara manual)
    await prisma.tb_plo_profil.deleteMany({
      where: { plo_id: ploIdInt }, // Gunakan ploIdInt
    });

    await prisma.tb_pi.deleteMany({
      where: { plo_id: ploIdInt }, // Gunakan ploIdInt
    });

    await prisma.tb_clo.deleteMany({
      where: { plo_id: ploIdInt }, // Gunakan ploIdInt
    });

    await prisma.tb_template_rubrik.deleteMany({
      where: { plo_id: ploIdInt }, // Gunakan ploIdInt
    });

    // Menghapus PLO setelah data terkait dihapus
    await prisma.tb_plo.delete({
      where: { plo_id: ploIdInt }, // Gunakan ploIdInt
    });

    return NextResponse.json(
      { message: "PLO berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting PLO:", error);
    return NextResponse.json({ error: "Gagal menghapus PLO" }, { status: 500 });
  }
}

// Handle OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: "POST, GET, PUT, DELETE",
    },
  });
}
