import prisma from "@/lib/prisma";

// Menangani permintaan POST untuk menambahkan pemetaan PLO dengan profil lulusan
export async function POST(req) {
  const { ploId, profilId } = await req.json();

  try {
    const mapping = await prisma.tb_plo_profil.create({
      data: {
        plo_id: ploId,
        profil_id: profilId,
      },
    });
    return new Response(JSON.stringify(mapping), { status: 201 });
  } catch (error) {
    console.error("Error saving mapping:", error);
    return new Response(JSON.stringify({ error: "Error saving mapping" }), {
      status: 500,
    });
  }
}

// Menangani permintaan GET untuk mengambil semua pemetaan PLO dengan deskripsi profil lulusan
export async function GET() {
  try {
    const mappings = await prisma.tb_plo_profil.findMany({
      include: {
        tb_profillulusan: {
          select: {
            deskripsi_profil: true,
          },
        },
        tb_plo: true,
      },
    });

    return new Response(JSON.stringify(mappings), { status: 200 });
  } catch (error) {
    console.error("Error fetching mappings:", error);
    return new Response(JSON.stringify({ error: "Error fetching mappings" }), {
      status: 500,
    });
  }
}

// Menangani permintaan OPTIONS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: "POST, GET",
    },
  });
}
