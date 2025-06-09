"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

const SkorPLOPage = () => {
  const [ploList, setPloList] = useState([]);
  const [selectedPloId, setSelectedPloId] = useState(null);
  const [piList, setPiList] = useState([]);
  const [weights, setWeights] = useState({});
  const [hasScore, setHasScore] = useState(false);
  const [isReadyToScore, setIsReadyToScore] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isPIPage = pathname.includes("/skor/pi");

  useEffect(() => {
    fetch("/api/plo")
      .then((res) => res.json())
      .then(setPloList)
      .catch(() => setPloList([]));
  }, []);

  useEffect(() => {
    if (!selectedPloId) {
      setPiList([]);
      setWeights({});
      setHasScore(false);
      setIsReadyToScore(false);
      return;
    }

    fetch(`/api/pi?plo_id=${selectedPloId}`)
      .then((res) => res.json())
      .then((data) => {
        const piWithSkor = data.filter(
          (pi) =>
            Array.isArray(pi.tb_skor_pi) &&
            pi.tb_skor_pi.some(
              (skorPi) => skorPi.skor !== undefined && skorPi.skor !== null
            )
        );

        setPiList(piWithSkor);

        const initialWeights = {};
        piWithSkor.forEach((pi) => {
          initialWeights[pi.pi_id] = "";
        });
        setWeights(initialWeights);

        setIsReadyToScore(data.length > 0 && piWithSkor.length === data.length);
      })
      .catch(() => {
        setPiList([]);
        setWeights({});
        setIsReadyToScore(false);
      });

    fetch(`/api/skor/check?plo_id=${selectedPloId}`)
      .then((res) => res.json())
      .then((d) => setHasScore(d.hasScore))
      .catch(() => setHasScore(false));
  }, [selectedPloId]);

  const handleWeightChange = (id, val) => {
    if (val === "") {
      setWeights((prev) => ({ ...prev, [id]: "" }));
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 1) return;
    setWeights((prev) => ({ ...prev, [id]: num }));
  };

  const totalWeight = Object.values(weights)
    .reduce((sum, w) => sum + (parseFloat(w) || 0), 0)
    .toFixed(2);

  const ploScore = piList
    .reduce((sum, pi) => {
      // Ambil skor dari tb_skor_pi array, misal skor dari elemen pertama
      const skorPi = Array.isArray(pi.tb_skor_pi)
        ? pi.tb_skor_pi[0]?.skor || 0
        : 0;
      return sum + skorPi * (parseFloat(weights[pi.pi_id]) || 0);
    }, 0)
    .toFixed(2);

  const handleSaveSkor = async () => {
    try {
      await axios.post("/api/skor/plo", {
        plo_id: selectedPloId,
        skor: parseFloat(ploScore),
      });

      alert("Skor PLO berhasil disimpan.");
      setHasScore(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan skor.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
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
        Generate Skor PLO
      </h1>

      {/* Dropdown PLO */}
      <div className="mb-6">
        <label className="text-gray-700 font-medium block mb-2">
          Pilih Profil Lulusan
        </label>
        <select
          className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
          value={selectedPloId || ""}
          onChange={(e) =>
            setSelectedPloId(e.target.value ? parseInt(e.target.value) : null)
          }
        >
          <option value="">-- Pilih PLO --</option>
          {ploList.map((plo) => (
            <option key={plo.plo_id} value={plo.plo_id}>
              PLO {plo.nomor_plo}
            </option>
          ))}
        </select>
      </div>

      {selectedPloId && (
        <p
          className={`mb-6 font-semibold ${
            hasScore ? "text-green-600" : "text-red-600"
          }`}
        >
          {hasScore
            ? "PLO ini sudah memiliki skor."
            : "PLO ini belum memiliki skor."}
        </p>
      )}

      {isReadyToScore ? (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Atur Bobot (0 – 1) per PI
          </h2>

          <div className="space-y-4 divide-y divide-gray-200">
            {piList.map((pi) => (
              <div
                key={pi.pi_id}
                className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50 transition"
              >
                <div className="w-2/3 font-medium text-gray-800">
                  PI {pi.nomor_pi}
                </div>
                <div className="flex flex-col items-start">
                  <label className="text-sm text-gray-600 mb-1">Bobot</label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={weights[pi.pi_id] ?? ""}
                    onChange={(e) =>
                      handleWeightChange(pi.pi_id, e.target.value)
                    }
                    placeholder="0.0"
                    className="border border-gray-300 rounded-md p-2 w-24 shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2 text-sm font-medium text-gray-700">
            <div>
              <span>Total Bobot: </span>
              <span
                className={`${
                  totalWeight == 1.0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totalWeight}
              </span>{" "}
              (target: 1.00)
            </div>
            <div className="text-lg mt-2">
              <span>Skor PLO: </span>
              <span className="font-bold text-primary">{ploScore}</span>
            </div>
          </div>
        </div>
      ) : selectedPloId ? (
        <div className="text-red-600 font-semibold mt-4">
          Tidak semua PI untuk PLO ini memiliki skor. Harap lengkapi skor PI
          terlebih dahulu.
        </div>
      ) : null}

      <div className="mt-8">
        <button
          onClick={handleSaveSkor}
          disabled={
            !selectedPloId || parseFloat(ploScore) === 0 || !isReadyToScore
          }
          className={`w-full px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300 ${
            !selectedPloId || parseFloat(ploScore) === 0 || !isReadyToScore
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Simpan Skor PLO
        </button>
      </div>
    </div>
  );
};

export default SkorPLOPage;
