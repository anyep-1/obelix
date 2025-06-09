"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/app/components/utilities/LoadingSpinner";

// Import html2pdf hanya di client
const html2pdf = dynamic(
  () => import("html2pdf.js").then((mod) => mod.default || mod),
  { ssr: false }
);

const ValidasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, monevRes] = await Promise.all([
          axios.get("/api/me"),
          axios.get(`/api/monev/${id}`),
        ]);
        setMe(meRes.data.user);
        setData(monevRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const downloadPdf = async () => {
    if (!contentRef.current) return;

    const html2pdfModule = await import("html2pdf.js");
    const html2pdfInstance = html2pdfModule.default || html2pdfModule;

    html2pdfInstance()
      .from(contentRef.current)
      .set({
        margin: 0.5,
        filename: `report-monev-${id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .save();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (!data.length) return <p>Belum ada data monev.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div ref={contentRef} className="bg-white p-8 shadow rounded">
        {data.map((monev) => (
          <div key={monev.monev_id} className="mb-16">
            <div
              className="text-center mb-2 leading-tight"
              style={{ lineHeight: "1.2" }}
            >
              <p className="text-base font-semibold uppercase">
                Formulir Monitoring dan Evaluasi Rencana Tindak Lanjut
              </p>
              <p className="text-sm uppercase">
                Hasil Rapat Tinjauan Manajemen (RTM)
              </p>
            </div>

            {/* Informasi Umum */}
            <table className="w-full mb-4 border border-black text-sm">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-semibold">
                    Program Studi
                  </td>
                  <td className="border border-black p-2">
                    {monev.programStudi}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-semibold">
                    Tanggal RTM
                  </td>
                  <td className="border border-black p-2">
                    {new Date(monev.tanggalRTM).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-semibold">
                    Tanggal Monitoring dan Evaluasi
                  </td>
                  <td className="border border-black p-2">
                    {new Date(monev.tanggalMonev).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-semibold">
                    Evaluasi Periode
                  </td>
                  <td className="border border-black p-2">
                    {monev.evaluasiPeriode}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tujuan dan Metode */}
            <h3 className="font-semibold mb-2">1. Informasi Umum</h3>
            <table className="w-full mb-4 border border-black text-sm">
              <thead>
                <tr>
                  <th className="border border-black p-2">Tujuan Evaluasi</th>
                  <th className="border border-black p-2">Metode Evaluasi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">
                    {monev.tujuanEvaluasi}
                  </td>
                  <td className="border border-black p-2">
                    {monev.metodeEvaluasi}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Daftar RT */}
            <h3 className="font-semibold mb-2">
              2. Daftar Rencana Tindak Lanjut Hasil RTM
            </h3>
            <table className="w-full mb-4 border border-black text-sm">
              <thead>
                <tr>
                  <th className="border border-black p-2">RT</th>
                  <th className="border border-black p-2">Deskripsi RT</th>
                </tr>
              </thead>
              <tbody>
                {monev.rtList.map((rt, i) => (
                  <tr key={rt.rt_id}>
                    <td className="border border-black p-2">RT{i + 1}</td>
                    <td className="border border-black p-2">
                      {rt.deskripsiRT}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Implementasi */}
            <h3 className="font-semibold mb-2">
              3. Implementasi Rencana Tindak Lanjut
            </h3>
            <table className="w-full mb-4 border border-black text-sm">
              <thead>
                <tr>
                  <th className="border border-black p-2">RT</th>
                  <th className="border border-black p-2">Status</th>
                  <th className="border border-black p-2">Tanggal Mulai</th>
                  <th className="border border-black p-2">Tanggal Selesai</th>
                </tr>
              </thead>
              <tbody>
                {monev.rtList.map((rt, i) => (
                  <tr key={rt.rt_id}>
                    <td className="border border-black p-2">RT{i + 1}</td>
                    <td className="border border-black p-2">
                      {rt.statusImplementasi}
                    </td>
                    <td className="border border-black p-2">
                      {new Date(rt.tanggalMulai).toLocaleDateString()}
                    </td>
                    <td className="border border-black p-2">
                      {new Date(rt.tanggalSelesai).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Evaluasi */}
            <h3 className="font-semibold mb-2">4. Evaluasi Pelaksanaan</h3>
            <table className="w-full mb-4 border border-black text-sm">
              <thead>
                <tr>
                  <th className="border border-black p-2">RT</th>
                  <th className="border border-black p-2">Analisis</th>
                  <th className="border border-black p-2">
                    Kendala dan Solusi
                  </th>
                </tr>
              </thead>
              <tbody>
                {monev.rtList.map((rt, i) => (
                  <tr key={rt.rt_id}>
                    <td className="border border-black p-2">RT{i + 1}</td>
                    <td className="border border-black p-2">
                      {rt.analisisKetercapaian}
                    </td>
                    <td className="border border-black p-2">
                      <p>
                        <strong>Kendala:</strong>{" "}
                        {rt.kendala.replace(/'/g, "’").replace(/"/g, "”")}
                      </p>
                      <p>
                        <strong>Solusi:</strong>{" "}
                        {rt.solusi.replace(/'/g, "’").replace(/"/g, "”")}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Link Bukti */}
            <h3 className="font-semibold mb-2">5. Link Bukti</h3>
            {monev.linkBukti ? (
              <a
                href={monev.linkBukti}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {monev.linkBukti}
              </a>
            ) : (
              <p className="text-gray-400 italic">Belum diisi</p>
            )}

            {/* Tanda Tangan */}
            <div
              style={{
                pageBreakInside: "avoid",
                breakInside: "avoid",
                marginTop: "3rem",
              }}
              className="grid grid-cols-2 gap-8 text-sm"
            >
              <div>
                <p className="font-semibold">Subjek Evaluasi</p>
                <p>Nama: {monev.userTujuan?.nama || "-"}</p>
                <p className="mt-8">Tanda Tangan:</p>
                <div className="h-16 border-b border-gray-500 w-48 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">Gugus Kendali Mutu</p>
                <p>Nama: {me?.nama || "-"}</p>
                <p className="mt-8">Tanda Tangan:</p>
                <div className="h-16 border-b border-gray-500 w-48 mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Download di BAWAH */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-gray-400"
        >
          ← Kembali
        </button>

        <button
          onClick={downloadPdf}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ValidasiDetail;
