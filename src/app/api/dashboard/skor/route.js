import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tahun = searchParams.get("tahun");
  const trend = searchParams.get("trend") === "true";

  try {
    if (trend) {
      // Ambil semua tahun kurikulum dan rata-rata skor PLO per tahun
      const kurikulumList = await prisma.tb_kurikulum.findMany({
        orderBy: { tahun_kurikulum: "asc" },
      });

      // Untuk tiap tahun kurikulum, hitung rata-rata skor PLO
      const labels = [];
      const dataGrafik = [];

      for (const kurikulum of kurikulumList) {
        const ploList = await prisma.tb_plo.findMany({
          where: {
            tb_kurikulum: {
              tahun_kurikulum: kurikulum.tahun_kurikulum,
            },
          },
          include: {
            tb_skor_plo: true,
          },
        });

        // Hitung rata-rata skor PLO per tahun kurikulum
        const skorArray = ploList.map((plo) => plo.tb_skor_plo[0]?.skor ?? 0);

        const rataRata =
          skorArray.length > 0
            ? skorArray.reduce((acc, val) => acc + val, 0) / skorArray.length
            : 0;

        labels.push(kurikulum.tahun_kurikulum);
        dataGrafik.push(parseFloat(rataRata.toFixed(2)));
      }

      return NextResponse.json({ labels, dataGrafik });
    }

    // Kalau bukan trend, ambil data PLO per tahun tertentu (default behavior)
    if (!tahun) {
      return NextResponse.json(
        { error: "Parameter tahun kurikulum wajib diisi" },
        { status: 400 }
      );
    }

    const ploList = await prisma.tb_plo.findMany({
      where: {
        tb_kurikulum: {
          tahun_kurikulum: tahun,
        },
      },
      orderBy: { nomor_plo: "asc" },
      include: { tb_skor_plo: true },
    });

    const sortedPloList = ploList.sort(
      (a, b) => parseInt(a.nomor_plo) - parseInt(b.nomor_plo)
    );

    const dataGrafik = ploList.map((plo) => plo.tb_skor_plo[0]?.skor ?? 0);
    const labels = ploList.map((plo) => `PLO ${plo.nomor_plo.trim()}`);

    const rataRata =
      dataGrafik.length > 0
        ? dataGrafik.reduce((acc, val) => acc + val, 0) / dataGrafik.length
        : 0;

    return NextResponse.json({
      labels,
      dataGrafik,
      rataRata: parseFloat(rataRata.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching PLO data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data PLO" },
      { status: 500 }
    );
  }
}
