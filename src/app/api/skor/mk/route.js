import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  try {
    const { template_id } = await req.json();
    if (!template_id) {
      return new Response(
        JSON.stringify({ message: "Template ID wajib diisi" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ambil template + CLO (snake_case)
    const template = await prisma.tb_template_rubrik.findUnique({
      where: { template_id: Number(template_id) },
      include: { tb_pi: { include: { tb_clo: true } } },
    });

    if (!template?.tb_pi?.tb_clo.length) {
      return new Response(
        JSON.stringify({ message: "Template atau CLO tidak ditemukan" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ambil nilai mahasiswa
    const cloList = template.tb_pi.tb_clo;
    const cloIds = cloList.map((c) => c.clo_id);
    const nilaiMahasiswa = await prisma.tb_nilai.findMany({
      where: { clo_id: { in: cloIds } },
    });

    if (!nilaiMahasiswa.length) {
      return new Response(
        JSON.stringify({ message: "Tidak ada data nilai mahasiswa" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse rubrik_kategori dan normalisasi
    const parsed =
      typeof template.rubrik_kategori === "string"
        ? JSON.parse(template.rubrik_kategori)
        : template.rubrik_kategori;
    const rubrik = {};
    for (const [k, v] of Object.entries(parsed)) {
      rubrik[k.toUpperCase()] = v;
    }
    const skorKategori = {
      EXEMPLARY: {
        skor: rubrik.EXEMPLARY.nilai,
        min: rubrik.EXEMPLARY.min,
        max: rubrik.EXEMPLARY.max,
      },
      SATISFACTORY: {
        skor: rubrik.SATISFACTORY.nilai,
        min: rubrik.SATISFACTORY.min,
        max: rubrik.SATISFACTORY.max,
      },
      DEVELOPING: {
        skor: rubrik.DEVELOPING.nilai,
        min: rubrik.DEVELOPING.min,
        max: rubrik.DEVELOPING.max,
      },
      UNSATISFACTORY: {
        skor: rubrik.UNSATISFACTORY.nilai,
        min: rubrik.UNSATISFACTORY.min,
        max: rubrik.UNSATISFACTORY.max,
      },
    };

    // Hitung & simpan per CLO
    const results = [];
    for (const clo of cloList) {
      const subset = nilaiMahasiswa.filter((n) => n.clo_id === clo.clo_id);
      let totalSkor = 0,
        total = subset.length;
      let exc = 0,
        sat = 0,
        dev = 0,
        uns = 0;

      subset.forEach((n) => {
        const v = n.nilai_per_question;
        if (
          v >= skorKategori.EXEMPLARY.min &&
          v <= skorKategori.EXEMPLARY.max
        ) {
          totalSkor += skorKategori.EXEMPLARY.skor;
          exc++;
        } else if (
          v >= skorKategori.SATISFACTORY.min &&
          v <= skorKategori.SATISFACTORY.max
        ) {
          totalSkor += skorKategori.SATISFACTORY.skor;
          sat++;
        } else if (
          v >= skorKategori.DEVELOPING.min &&
          v <= skorKategori.DEVELOPING.max
        ) {
          totalSkor += skorKategori.DEVELOPING.skor;
          dev++;
        } else {
          totalSkor += skorKategori.UNSATISFACTORY.skor;
          uns++;
        }
      });

      const skorAkhir = total > 0 ? totalSkor / total : 0;

      const record = await prisma.tb_skor_clo.upsert({
        where: {
          clo_id_template_id: {
            clo_id: clo.clo_id,
            template_id: Number(template_id),
          },
        },
        update: {
          skor: skorAkhir,
        },
        create: {
          clo_id: clo.clo_id,
          skor: skorAkhir,
          template_id: Number(template_id),
        },
      });

      const lulus = exc + sat;
      const persen_kelulusan = total > 0 ? (lulus / total) * 100 : 0;

      results.push({
        clo_id: clo.clo_id,
        total,
        counts: { exc, sat, dev, uns },
        skor: skorAkhir,
        persen_kelulusan,
        saved: record,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Skor per CLO berhasil disimpan",
        data: results,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error saat generate & simpan skor:", err);
    return new Response(
      JSON.stringify({ message: "Gagal generate skor", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
