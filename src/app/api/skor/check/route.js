import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pi_id = searchParams.get("pi_id");
    const plo_id = searchParams.get("plo_id");

    if (!pi_id && !plo_id) {
      return new Response(
        JSON.stringify({ error: "pi_id atau plo_id harus disertakan" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (pi_id) {
      const piIdInt = parseInt(pi_id, 10);
      if (isNaN(piIdInt)) {
        return new Response(
          JSON.stringify({ error: "pi_id harus angka yang valid" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Cek ada tidaknya skor di tb_skor_pi
      const skorPi = await prisma.tb_skor_pi.findUnique({
        where: {
          pi_id: piIdInt,
        },
      });

      if (!skorPi) {
        return new Response(JSON.stringify({ hasScore: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ hasScore: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (plo_id) {
      const ploIdInt = parseInt(plo_id, 10);
      if (isNaN(ploIdInt)) {
        return new Response(
          JSON.stringify({ error: "plo_id harus angka yang valid" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Ambil PI yang terkait PLO
      const piRelated = await prisma.tb_pi.findMany({
        where: {
          plo_id: ploIdInt,
        },
        select: {
          pi_id: true,
        },
      });

      if (piRelated.length === 0) {
        return new Response(JSON.stringify({ hasScore: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const piIds = piRelated.map((p) => p.pi_id);

      // Cek apakah ada PI yang sudah punya skor di tb_skor_pi
      const skorPiExist = await prisma.tb_skor_pi.findFirst({
        where: {
          pi_id: { in: piIds },
        },
      });

      if (!skorPiExist) {
        return new Response(JSON.stringify({ hasScore: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ hasScore: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
