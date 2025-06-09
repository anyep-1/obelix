"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/utilities/LoadingSpinner";

function RubrikDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [tpl, setTpl] = useState(null);
  const [kategoriCount, setKategoriCount] = useState(null);
  const [jumlahMahasiswa, setJumlahMahasiswa] = useState(0);

  useEffect(() => {
    setTpl(null);
    setKategoriCount(null);
    setJumlahMahasiswa(0);

    fetch(`/api/rubrik/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTpl(data.template);
        setKategoriCount(data.kategoriCount);
        setJumlahMahasiswa(data.jumlahMahasiswa);
      })
      .catch(console.error);
  }, [id]);

  if (!tpl || !kategoriCount) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const skorFinalRaw = Array.isArray(tpl.tb_skor_clo)
    ? tpl.tb_skor_clo[0]?.skor || 0
    : tpl.tb_skor_clo?.skor || 0;
  const skorFinal = parseFloat(skorFinalRaw).toFixed(2);
  const jumlahFinal = jumlahMahasiswa || 0;

  const rubrik =
    typeof tpl.rubrik_kategori === "string"
      ? JSON.parse(tpl.rubrik_kategori)
      : tpl.rubrik_kategori;

  async function downloadPDF() {
    const el = document.getElementById("to-pdf");
    if (!el) {
      console.error("Element to-pdf not found");
      return;
    }
    try {
      const html2pdfModule = await import("html2pdf.js");
      html2pdfModule
        .default()
        .from(el)
        .set({
          margin: [0.2, 0.2, 0.2, 0.2],
          filename: `rubrik_${id}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .save();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }

  return (
    <div className="p-4">
      <div
        id="to-pdf"
        className="mx-auto p-4"
        style={{
          width: "8.27in",
          border: "1px solid #000",
          lineHeight: 1.2,
        }}
      >
        <h1 className="text-center font-bold mb-2">
          RUBRIK PENGUKURAN PLO {tpl.tb_plo?.nomor_plo}
        </h1>

        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border px-2 py-1 font-semibold w-1/4">Kuliah</td>
              <td className="border px-2 py-1 w-1/4">
                {tpl.tb_matkul.nama_matkul}
              </td>
              <td className="border px-2 py-1 font-semibold w-1/4">
                Objek pengukuran
              </td>
              <td className="border px-2 py-1 w-1/4">{tpl.objek_pengukuran}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1 font-semibold">TA-Semester</td>
              <td className="border px-2 py-1">{tpl.ta_semester}</td>
              <td className="border px-2 py-1">&nbsp;</td>
              <td className="border px-2 py-1">&nbsp;</td>
            </tr>
            <tr>
              <td className="border px-2 py-1 font-semibold align-top">
                Dosen pengampu
              </td>
              <td className="border px-2 py-1" colSpan={3}>
                {(Array.isArray(tpl.dosen_pengampu)
                  ? tpl.dosen_pengampu
                  : JSON.parse(tpl.dosen_pengampu)
                ).map((dosen, i) => (
                  <div key={i}>{dosen}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="font-semibold mt-4">Pengukuran Luaran</div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1" colSpan={2}>
                Program Learning Outcome:
              </th>
              <th
                className="border px-2 py-1 text-left font-normal"
                colSpan={2}
              >
                {tpl.tb_plo.nama_plo}
              </th>
            </tr>
            <tr>
              <th className="border px-2 py-1" colSpan={2}>
                Performance Indicator:
              </th>
              <th
                className="border px-2 py-1 text-left font-normal"
                colSpan={2}
              >
                {tpl.tb_pi.deskripsi_pi}
              </th>
            </tr>
            <tr>
              <th className="border px-2 py-1 text-center" colSpan={4}>
                Klasifikasi Pengukuran Luaran
              </th>
            </tr>
            <tr>
              {[
                "Exemplary",
                "Satisfactory",
                "Developing",
                "Unsatisfactory",
              ].map((t) => (
                <th key={t} className="border px-2 py-1">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">
                {rubrik.exemplary?.deskripsi || ""}
              </td>
              <td className="border px-2 py-1">
                {rubrik.satisfactory?.deskripsi || ""}
              </td>
              <td className="border px-2 py-1">
                {rubrik.developing?.deskripsi || ""}
              </td>
              <td className="border px-2 py-1">
                {rubrik.unsatisfactory?.deskripsi || ""}
              </td>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-center" colSpan={4}>
                Hasil ({jumlahFinal} sampel)
              </th>
            </tr>
            <tr>
              <th className="border px-2 py-1">Exemplary (4)</th>
              <th className="border px-2 py-1">Satisfactory (3)</th>
              <th className="border px-2 py-1">Developing (2)</th>
              <th className="border px-2 py-1">Unsatisfactory (1)</th>
            </tr>
            <tr>
              <td className="border px-2 py-1">
                {kategoriCount.EXEMPLARY || 0}
              </td>
              <td className="border px-2 py-1">
                {kategoriCount.SATISFACTORY || 0}
              </td>
              <td className="border px-2 py-1">
                {kategoriCount.DEVELOPING || 0}
              </td>
              <td className="border px-2 py-1">
                {kategoriCount.UNSATISFACTORY || 0}
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-1" colSpan={4}>
                <div>Skor:</div>
                <div className="pl-4">
                  {skorFinal} dari {jumlahFinal} mahasiswa
                </div>
                <div className="mt-2 text-sm text-gray-600 italic">
                  *Jika belum ada skor tersimpan, sistem menampilkan 0
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => router.back()}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          ← Kembali
        </button>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default RubrikDetail;
