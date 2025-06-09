"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const SkorGenerate = () => {
  const [piList, setPiList] = useState([]);
  const [selectedPiId, setSelectedPiId] = useState(null);
  const [weights, setWeights] = useState({});
  const [matkulList, setMatkulList] = useState([]);
  const [hasScore, setHasScore] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isPIPage = pathname.includes("/skor/pi");

  useEffect(() => {
    fetch("/api/pi")
      .then((r) => r.json())
      .then(setPiList)
      .catch(() => setPiList([]));
  }, []);

  useEffect(() => {
    if (!selectedPiId) {
      setMatkulList([]);
      setWeights({});
      setHasScore(false);
      return;
    }

    fetch(`/api/clo?pi_id=${selectedPiId}`)
      .then((r) => r.json())
      .then((data) => {
        const withScore = data.filter(
          (c) => Array.isArray(c.tb_skor_clo) && c.tb_skor_clo.length > 0
        );

        const uniq = new Map();
        withScore.forEach((c) => {
          const skor = c.tb_skor_clo[0].skor;
          uniq.set(c.matkul_id, {
            matkul_id: c.matkul_id,
            nama: c.tb_matkul.nama_matkul,
            skor,
          });
        });

        const list = Array.from(uniq.values());
        setMatkulList(list);

        const w = {};
        list.forEach((m) => {
          w[m.matkul_id] = "";
        });
        setWeights(w);
      })
      .catch(() => {
        setMatkulList([]);
        setWeights({});
      });

    fetch(`/api/skor/check?pi_id=${selectedPiId}`)
      .then((r) => r.json())
      .then((d) => setHasScore(d.hasScore))
      .catch(() => setHasScore(false));
  }, [selectedPiId]);

  const handleWeightChange = (mid, v) => {
    if (v === "") {
      setWeights((w) => ({ ...w, [mid]: "" }));
      return;
    }
    const val = parseFloat(v);
    if (isNaN(val) || val < 0 || val > 1) return;
    setWeights((w) => ({ ...w, [mid]: val }));
  };

  const handleSaveSkor = async () => {
    try {
      await axios.post("/api/skor/pi", {
        pi_id: selectedPiId,
        skor: parseFloat(piScore),
      });

      alert("Skor PI berhasil disimpan.");
      setHasScore(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan skor.");
    }
  };

  const piScore = matkulList
    .reduce(
      (sum, m) => sum + m.skor * (parseFloat(weights[m.matkul_id]) || 0),
      0
    )
    .toFixed(2);

  const totalWeight = Object.values(weights)
    .reduce((sum, w) => sum + (parseFloat(w) || 0), 0)
    .toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      {/* Tab Switch */}
      <div className="flex space-x-8 border-b mb-6 text-gray-600 font-medium">
        <button
          onClick={() => router.push("/skor/pi")}
          className={`pb-2 transition duration-200 ${
            isPIPage
              ? "border-b-2 border-teal-600 text-teal-700"
              : "hover:text-teal-600"
          }`}
        >
          Generate Skor PI
        </button>
        <button
          onClick={() => router.push("/skor/plo")}
          className={`pb-2 transition duration-200 ${
            !isPIPage
              ? "border-b-2 border-teal-600 text-teal-700"
              : "hover:text-teal-600"
          }`}
        >
          Generate Skor PLO
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Generate Skor PI
      </h1>

      {/* Dropdown PI */}
      <div className="mb-6">
        <label className="text-gray-700 font-medium block mb-2">
          Pilih Performance Indicator
        </label>
        <select
          className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
          value={selectedPiId || ""}
          onChange={(e) =>
            setSelectedPiId(e.target.value ? parseInt(e.target.value) : null)
          }
        >
          <option value="">-- Pilih PI --</option>
          {piList.map((pi) => (
            <option key={pi.pi_id} value={pi.pi_id}>
              PI {pi.nomor_pi}
            </option>
          ))}
        </select>
      </div>

      {selectedPiId && (
        <p
          className={`mb-6 font-semibold ${
            hasScore ? "text-green-600" : "text-red-600"
          }`}
        >
          {hasScore
            ? "PI ini sudah memiliki skor."
            : "PI ini belum memiliki skor."}
        </p>
      )}

      {matkulList.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Atur Bobot (0 – 1) per Mata Kuliah
          </h2>

          <div className="space-y-3">
            {matkulList.map(({ matkul_id, nama }) => (
              <div
                key={matkul_id}
                className="flex justify-between items-center px-4 py-2 rounded-md border border-gray-200 hover:border-teal-400 transition"
              >
                <div className="text-gray-800 font-medium">{nama}</div>
                <div className="flex flex-col items-start">
                  <label className="text-sm text-gray-600 mb-1">Bobot</label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={weights[matkul_id] ?? ""}
                    onChange={(e) =>
                      handleWeightChange(matkul_id, e.target.value)
                    }
                    placeholder="0.0"
                    className="border border-gray-300 rounded-md p-2 w-24 shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm font-medium text-gray-700 space-y-1">
            <div>
              Total Bobot:{" "}
              <span
                className={`font-semibold ${
                  totalWeight == 1.0 ? "text-green-600" : "text-black"
                }`}
              >
                {totalWeight}
              </span>{" "}
              (target: 1.00)
            </div>
            <div className="text-lg mt-2">
              Skor PI:{" "}
              <span className="font-bold text-teal-600">{piScore}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleSaveSkor}
          disabled={!selectedPiId || parseFloat(piScore) === 0}
          className={`w-full px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300 ${
            !selectedPiId || parseFloat(piScore) === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          Simpan Skor PI
        </button>
      </div>
    </div>
  );
};

export default SkorGenerate;
