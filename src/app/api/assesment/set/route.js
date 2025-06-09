import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const matkulData = await prisma.tb_matkul.findMany();

    const selectedMatkul = await prisma.tb_selected_matkul.findMany({
      where: { selected: true },
      select: { matkul_id: true },
    });

    const selectedIds = selectedMatkul.map((item) => item.matkul_id);

    const dataWithSelected = matkulData.map((matkul) => ({
      ...matkul,
      isSelected: selectedIds.includes(matkul.matkul_id),
    }));

    return new Response(JSON.stringify({ data: dataWithSelected }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saat mengambil data:", error);
    return new Response(JSON.stringify({ error: "Gagal mengambil data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const { selectedMatkul } = await request.json();

    if (!Array.isArray(selectedMatkul)) {
      return new Response(
        JSON.stringify({ error: "Data selectedMatkul harus array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Reset semua selected jadi false dulu
    await prisma.tb_selected_matkul.updateMany({
      data: { selected: false },
    });

    // Loop update/insert per matkulId
    for (const matkulId of selectedMatkul) {
      // Cek dulu ada gak record dengan matkul_id ini
      const existing = await prisma.tb_selected_matkul.findFirst({
        where: { matkul_id: matkulId },
      });

      if (existing) {
        // Kalau ada, update berdasarkan id-nya
        await prisma.tb_selected_matkul.update({
          where: { id: existing.id },
          data: { selected: true },
        });
      } else {
        // Kalau gak ada, buat baru
        await prisma.tb_selected_matkul.create({
          data: {
            matkul_id: matkulId,
            selected: true,
          },
        });
      }
    }

    return new Response(JSON.stringify({ message: "Data berhasil disimpan" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    return new Response(
      JSON.stringify({ error: "Gagal menyimpan data", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request) {
  try {
    // Reset semua pilihan
    await prisma.tb_selected_matkul.updateMany({
      data: { selected: false },
    });

    return new Response(
      JSON.stringify({ message: "Semua pilihan berhasil direset" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saat mereset data:", error);
    return new Response(
      JSON.stringify({ error: "Gagal mereset data", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
