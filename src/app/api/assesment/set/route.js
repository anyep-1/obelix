import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ploData = await prisma.tb_plo.findMany({
      include: {
        tb_pi: {
          include: {
            tb_clo: {
              include: {
                tb_matkul: {
                  include: {
                    tb_selected_matkul: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const groupedByPLO = ploData.map((plo) => {
      const matkulMap = new Map();

      for (const pi of plo.tb_pi) {
        for (const clo of pi.tb_clo) {
          const matkul = clo.tb_matkul;
          if (matkul && !matkulMap.has(matkul.matkul_id)) {
            const selectedRecord = matkul.tb_selected_matkul?.find(
              (s) => s.plo_id === plo.plo_id
            );

            matkulMap.set(matkul.matkul_id, {
              matkul_id: matkul.matkul_id,
              nama_matkul: matkul.nama_matkul,
              kode_matkul: matkul.kode_matkul,
              jumlah_sks: matkul.jumlah_sks,
              isSelected: selectedRecord?.selected ?? false,
            });
          }
        }
      }

      return {
        plo_id: plo.plo_id,
        nomor_plo: plo.nomor_plo,
        nama_plo: plo.nama_plo,
        matkul: Array.from(matkulMap.values()),
      };
    });

    return new Response(JSON.stringify({ data: groupedByPLO }), {
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
        JSON.stringify({ error: "selectedMatkul harus array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Reset semua selected menjadi false
    await prisma.tb_selected_matkul.updateMany({
      data: { selected: false },
    });

    for (const { matkul_id, plo_id } of selectedMatkul) {
      // Validasi: apakah matkul ini memang punya CLO yang terhubung ke PLO ini
      const isLinked = await prisma.tb_matkul.findFirst({
        where: {
          matkul_id,
          tb_clo: {
            some: {
              tb_pi: {
                tb_plo: {
                  plo_id: plo_id,
                },
              },
            },
          },
        },
      });

      if (!isLinked) continue;

      const existing = await prisma.tb_selected_matkul.findFirst({
        where: {
          matkul_id,
          plo_id,
        },
      });

      if (existing) {
        await prisma.tb_selected_matkul.update({
          where: { id: existing.id },
          data: { selected: true },
        });
      } else {
        await prisma.tb_selected_matkul.create({
          data: { matkul_id, plo_id, selected: true },
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
      JSON.stringify({ error: "Gagal menyimpan data", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.tb_selected_matkul.updateMany({
      data: {
        selected: false,
        plo_id: null, // Reset juga PLO
      },
    });

    return new Response(
      JSON.stringify({ message: "Semua pilihan berhasil direset" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saat mereset data:", error);
    return new Response(
      JSON.stringify({ error: "Gagal mereset data", detail: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
