"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import ModalSetting from "../components/utilities/ModalSetting";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  // state untuk data dan grafik
  const [totalMatkul, setTotalMatkul] = useState(0);
  const [data, setData] = useState({
    totalValidasi: 0,
    totalPending: 0,
    evaluasiTerbaru: [],
  });

  const [tahunList, setTahunList] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState(null);

  const [ploData, setPloData] = useState({
    labels: [],
    dataGrafik: [],
    rataRata: 0,
  });

  const [trendData, setTrendData] = useState({
    labels: [],
    dataGrafik: [],
  });

  // state khusus role user dan modal
  const [userRole, setUserRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // nilai minimum dari backend
  const [nilaiMinimum, setNilaiMinimum] = useState(3);

  // fetch user info sekali di awal
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((json) => {
        setUserRole(json.user?.role || null);
      })
      .catch(() => setUserRole(null));
  }, []);

  // fetch nilai minimum setiap kali userRole berubah
  useEffect(() => {
    if (userRole) {
      fetch("/api/dashboard/setting", { cache: "no-store" })
        .then((res) => res.json())
        .then((json) => {
          if (json.nilai_minimum !== undefined) {
            setNilaiMinimum(json.nilai_minimum);
          }
        })
        .catch(() => {});
    }
  }, [userRole]);

  // fetch data evaluasi terbaru
  useEffect(() => {
    fetch("/api/dashboard/evaluasi")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  // fetch total matkul
  useEffect(() => {
    fetch("/api/dashboard/matkul")
      .then((res) => res.json())
      .then((json) => setTotalMatkul(json.total || 0))
      .catch(() => {});
  }, []);

  // fetch daftar tahun kurikulum
  useEffect(() => {
    fetch("/api/kurikulum")
      .then((res) => res.json())
      .then((json) => {
        setTahunList(json);
        if (json.length > 0) {
          setSelectedTahun(json[0].tahun_kurikulum);
        }
      })
      .catch(() => {});
  }, []);

  // fetch data trend skor PLO
  useEffect(() => {
    fetch("/api/dashboard/skor?trend=true")
      .then((res) => res.json())
      .then((json) => {
        setTrendData({
          labels: json.labels || [],
          dataGrafik: json.dataGrafik || [],
        });
      })
      .catch(() => {
        setTrendData({ labels: [], dataGrafik: [] });
      });
  }, []);

  // fetch data PLO per tahun ketika selectedTahun berubah
  useEffect(() => {
    if (selectedTahun) {
      fetch(`/api/dashboard/skor?tahun=${selectedTahun}`)
        .then((res) => res.json())
        .then((json) => {
          setPloData({
            labels: json.labels || [],
            dataGrafik: json.dataGrafik || [],
            rataRata: json.rataRata || 0,
          });
        })
        .catch(() => {
          setPloData({ labels: [], dataGrafik: [], rataRata: 0 });
        });
    }
  }, [selectedTahun]);

  // data chart bar dengan nilai minimum dinamis
  const barData = {
    labels: ploData.labels,
    datasets: [
      {
        label: "Skor PLO",
        data: ploData.dataGrafik,
        backgroundColor: "#8FBCE6",
        borderColor: "#7AA9D9",
        borderWidth: 1,
      },
      {
        label: "Nilai Minimum",
        data: ploData.labels.map(() => nilaiMinimum),
        type: "line",
        borderColor: "#E68F8F",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#000" } },
      title: {
        display: true,
        text: `Grafik Skor PLO Tahun ${selectedTahun}`,
        color: "#000",
      },
    },
    scales: {
      y: { min: 0, max: 4, ticks: { stepSize: 1, color: "#000" } },
      x: { ticks: { color: "#000" } },
    },
  };

  const lineData = {
    labels: trendData.labels,
    datasets: [
      {
        label: "Rata-rata Skor PLO per Tahun",
        data: trendData.dataGrafik,
        borderColor: "#4C9AFF",
        backgroundColor: "rgba(76, 154, 255, 0.3)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#000" } },
      title: {
        display: true,
        text: "Trend Rata-rata Skor PLO per Tahun Kurikulum",
        color: "#000",
      },
    },
    scales: {
      y: { min: 0, max: 4, ticks: { stepSize: 1, color: "#000" } },
      x: { ticks: { color: "#000" } },
    },
  };

  // handler save setting dari modal
  const handleSaveSetting = async (newNilaiMinimum) => {
    try {
      const res = await axios.put("/api/dashboard/setting", {
        nilai_minimum: newNilaiMinimum,
      });

      if (res.status !== 200) throw new Error("Gagal update nilai minimum");

      setNilaiMinimum(newNilaiMinimum);
      setModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-black bg-white min-h-screen">
      <header className="flex justify-between items-center border-b border-gray-300 pb-6 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard Monitoring & Evaluasi PLO
        </h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Mata Kuliah", value: totalMatkul },
          { label: "Total Validasi", value: data.totalValidasi },
          { label: "Rata-rata Skor PLO", value: ploData.rataRata.toFixed(2) },
          { label: "Evaluasi Pending", value: data.totalPending },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center items-center border border-gray-300"
          >
            <h2 className="text-sm font-medium text-gray-700 mb-1">{label}</h2>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label
            htmlFor="tahun"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tahun Kurikulum:
          </label>
          <select
            id="tahun"
            className="border border-gray-300 rounded px-3 py-2"
            value={selectedTahun || ""}
            onChange={(e) => setSelectedTahun(e.target.value)}
          >
            <option value="" disabled hidden>
              Tahun Kurikulum
            </option>
            {tahunList.map((kurikulum) => (
              <option
                key={kurikulum.kurikulum_id}
                value={kurikulum.tahun_kurikulum}
              >
                {kurikulum.tahun_kurikulum}
              </option>
            ))}
          </select>
        </div>

        {userRole === "Kaprodi" && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Atur Nilai Minimum
          </button>
        )}
      </div>

      {/* Container grafik bar dan line berdampingan */}
      <section className="flex flex-col sm:flex-row gap-6 mb-12">
        <div
          className="flex-1 bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-300"
          style={{ minHeight: 300 }}
        >
          <Bar data={barData} options={barOptions} />
        </div>

        <div
          className="flex-1 bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-300"
          style={{ minHeight: 300 }}
        >
          <Line data={lineData} options={lineOptions} />
        </div>
      </section>

      <section className="bg-gray-50 rounded-lg p-6 border border-gray-300">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
          Evaluasi Terbaru
        </h2>
        <ul className="divide-y divide-gray-300">
          {(data.evaluasiTerbaru || []).map(({ id, matkul, tanggal }) => (
            <li
              key={id}
              className="flex justify-between py-3 text-sm text-gray-800"
            >
              <span>{matkul}</span>
              <time dateTime={tanggal}>
                {tanggal
                  ? new Date(tanggal).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </time>
            </li>
          ))}
        </ul>
      </section>

      {/* Modal setting */}
      {modalOpen && (
        <ModalSetting
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          nilaiMinimum={nilaiMinimum}
          onSave={handleSaveSetting}
        />
      )}
    </div>
  );
}

export default Dashboard;
