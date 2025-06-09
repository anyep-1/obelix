import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Handle GET request
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const kurikulumId = searchParams.get("kurikulumId");

  try {
    const profillulusan = await prisma.tb_profillulusan.findMany({
      where: {
        kurikulum_id: kurikulumId ? parseInt(kurikulumId, 10) : undefined,
      },
      include: {
        tb_kurikulum: true,
      },
    });
    return NextResponse.json(profillulusan);
  } catch (error) {
    return NextResponse.error(new Error("Failed to fetch data"));
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { tahunKurikulum, deskripsiProfil, namaPLO } = body;

    // Validasi input
    if (!tahunKurikulum || !deskripsiProfil || deskripsiProfil.length === 0) {
      return NextResponse.json(
        { error: "Semua field wajib diisi!" },
        { status: 400 }
      );
    }

    // Cek apakah tahun kurikulum sudah ada di database
    let existingKurikulum = await prisma.tb_kurikulum.findFirst({
      where: { tahun_kurikulum: tahunKurikulum },
    });

    let kurikulumId;
    if (existingKurikulum) {
      kurikulumId = existingKurikulum.kurikulum_id;
    } else {
      const newKurikulum = await prisma.tb_kurikulum.create({
        data: { tahun_kurikulum: tahunKurikulum },
      });
      kurikulumId = newKurikulum.kurikulum_id;
    }

    // Simpan profil lulusan
    const savedProfilIds = [];
    for (const deskripsi of deskripsiProfil) {
      const newProfilLulusan = await prisma.tb_profillulusan.create({
        data: {
          deskripsi_profil: deskripsi.label,
          kurikulum_id: kurikulumId,
        },
      });
      savedProfilIds.push(newProfilLulusan.profil_id);
    }

    // Simpan PLO dan relasi hanya jika namaPLO disediakan
    if (namaPLO) {
      const newPLO = await prisma.tb_plo.create({
        data: {
          nama_plo: namaPLO,
          kurikulum_id: kurikulumId,
        },
      });

      const ploProfilData = savedProfilIds.map((profilId) => ({
        plo_id: newPLO.plo_id,
        profil_id: profilId,
      }));

      await prisma.tb_plo_profil.createMany({
        data: ploProfilData,
      });
    }

    return NextResponse.json(
      { message: "Data berhasil disimpan!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { error: "Failed to create data" },
      { status: 500 }
    );
  }
}

// Handle PUT request untuk edit profil lulusan
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const profilId = searchParams.get("profilId"); // Ambil ID dari query string
    const body = await req.json();
    const { deskripsiProfil } = body;

    if (!profilId || !deskripsiProfil) {
      return NextResponse.json(
        { error: "Profil ID dan deskripsi wajib diisi!" },
        { status: 400 }
      );
    }

    const updatedProfil = await prisma.tb_profillulusan.update({
      where: { profil_id: parseInt(profilId, 10) },
      data: { deskripsi_profil: deskripsiProfil },
    });

    return NextResponse.json(
      { message: "Data berhasil diperbarui!", updatedProfil },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

// Handle DELETE request untuk menghapus profil lulusan
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const profilId = searchParams.get("profilId");

    if (!profilId) {
      return NextResponse.json(
        { error: "Profil ID wajib diisi!" },
        { status: 400 }
      );
    }

    await prisma.tb_profillulusan.delete({
      where: { profil_id: parseInt(profilId, 10) },
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
