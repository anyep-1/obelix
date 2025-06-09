"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "@/app/components/utilities/LoadingSpinner";

const ReportDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkInputs, setLinkInputs] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, monevRes] = await Promise.all([
          axios.get("/api/me"),
          axios.get(`/api/monev/${id}`),
        ]);
        setMe(meRes.data.user);
        setData(monevRes.data);

        const inputMap = {};
        monevRes.data.forEach((m) => {
          inputMap[m.monev_id] = m.linkBukti || "";
        });
        setLinkInputs(inputMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleLinkChange = (monev_id, value) => {
    setLinkInputs((prev) => ({ ...prev, [monev_id]: value }));
  };

  const handleSubmitLink = async (monev_id) => {
    try {
      const linkBukti = linkInputs[monev_id];
      // Update link bukti di backend
      await axios.patch(`/api/monev/bukti/${monev_id}`, { linkBukti });

      // Update state frontend: linkBukti dan RT yg statusnya 'ditolak' jadi 'Dalam Proses'
      const updated = data.map((item) => {
        if (item.monev_id === monev_id) {
          const updatedRtList = item.rtList.map((rt) =>
            rt.statusImplementasi.toLowerCase() === "ditolak"
              ? { ...rt, statusImplementasi: "Dalam Proses" }
              : rt
          );

          return {
            ...item,
            linkBukti,
            rtList: updatedRtList,
          };
        }
        return item;
      });

      setData(updated);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan link");
    }
  };

  const handleStatusUpdate = async (rt_id, newStatus) => {
    try {
      await axios.patch(`/api/monev/rt/status/${rt_id}`, {
        status: newStatus,
      });

      const updated = data.map((monev) => {
        const hasRT = monev.rtList.some((rt) => rt.rt_id === rt_id);
        if (!hasRT) return monev;

        const updatedRtList = monev.rtList.map((rt) =>
          rt.rt_id === rt_id ? { ...rt, statusImplementasi: newStatus } : rt
        );

        return {
          ...monev,
          rtList: updatedRtList,
        };
      });

      setData(updated);
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah status");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (!data.length) return <p>Belum ada data monev.</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow rounded">
      {data.map((monev) => {
        const isUserTujuan = me?.user_id === monev.userTujuanId;
        const hasDitolak = monev.rtList.some(
          (rt) => rt.statusImplementasi.toLowerCase() === "ditolak"
        );

        return (
          <div key={monev.monev_id} className="mb-16">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold uppercase">
                Formulir Monitoring dan Evaluasi Rencana Tindak Lanjut
              </h1>
              <h2 className="text-sm uppercase">
                Hasil Rapat Tinjauan Manajemen (RTM)
              </h2>
            </div>

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
                  <td className="border border-black p-2 align-top">
                    {monev.tujuanEvaluasi}
                  </td>
                  <td className="border border-black p-2 align-top">
                    {monev.metodeEvaluasi}
                  </td>
                </tr>
              </tbody>
            </table>

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

            <h3 className="font-semibold mb-2">
              4. Evaluasi Pelaksanaan Rencana Tindak Lanjut
            </h3>
            <table className="w-full mb-4 border border-black text-sm">
              <thead>
                <tr>
                  <th className="border border-black p-2">RT</th>
                  <th className="border border-black p-2">
                    Analisis Ketercapaian
                  </th>
                  <th className="border border-black p-2">
                    Kendala dan Solusi
                  </th>
                </tr>
              </thead>
              <tbody>
                {monev.rtList.map((rt, i) => (
                  <tr key={rt.rt_id}>
                    <td className="border border-black p-2 align-top">
                      RT{i + 1}
                    </td>
                    <td className="border border-black p-2 align-top">
                      {rt.analisisKetercapaian}
                    </td>
                    <td className="border border-black p-2 align-top">
                      <p>
                        <strong>Kendala:</strong> {rt.kendala}
                      </p>
                      <p>
                        <strong>Solusi:</strong> {rt.solusi}
                      </p>

                      {me?.role === "GugusKendaliMutu" &&
                        rt.statusImplementasi.toLowerCase() ===
                          "dalam proses" && (
                          <div className="mt-2 space-x-2">
                            <button
                              className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                              onClick={() =>
                                handleStatusUpdate(rt.rt_id, "Sudah")
                              }
                            >
                              Diterima
                            </button>
                            <button
                              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                              onClick={() =>
                                handleStatusUpdate(rt.rt_id, "Ditolak")
                              }
                            >
                              Ditolak
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="font-semibold mb-2">5. Link Bukti</h3>
            {monev.linkBukti && !hasDitolak ? (
              <a
                href={monev.linkBukti}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {monev.linkBukti}
              </a>
            ) : isUserTujuan ? (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Masukkan link Google Drive"
                  className="border rounded px-3 py-1 w-full mb-2"
                  value={linkInputs[monev.monev_id] || ""}
                  onChange={(e) =>
                    handleLinkChange(monev.monev_id, e.target.value)
                  }
                />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleSubmitLink(monev.monev_id)}
                >
                  Simpan Link Bukti
                </button>
              </div>
            ) : (
              <p>Link bukti belum tersedia</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReportDetail;
