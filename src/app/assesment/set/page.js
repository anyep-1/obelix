"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ModalSuccess from "@/app/components/utilities/ModalSuccess";
import ModalDelete from "@/app/components/utilities/ModalDelete";
import LoadingSpinner from "@/app/components/utilities/LoadingSpinner";

const AssessmentSet = () => {
  const [matkulList, setMatkulList] = useState([]);
  const [selectedMatkul, setSelectedMatkul] = useState([]); // array of { plo_id, matkul_id }
  const [loading, setLoading] = useState(true);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/assesment/set");
        const data = response.data.data;

        setMatkulList(data);

        // Ambil selected dari masing-masing PLO
        const selected = data.flatMap((plo) =>
          plo.matkul
            .filter((m) => m.isSelected)
            .map((m) => ({
              plo_id: plo.plo_id,
              matkul_id: m.matkul_id,
            }))
        );

        setSelectedMatkul(selected);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isChecked = (ploId, matkulId) =>
    selectedMatkul.some(
      (item) => item.plo_id === ploId && item.matkul_id === matkulId
    );

  const handleMatkulSelection = (event, ploId, matkulId) => {
    const key = { plo_id: ploId, matkul_id: matkulId };

    if (event.target.checked) {
      setSelectedMatkul((prev) => [...prev, key]);
    } else {
      setSelectedMatkul((prev) =>
        prev.filter(
          (item) => !(item.plo_id === ploId && item.matkul_id === matkulId)
        )
      );
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/assesment/set", { selectedMatkul });
      setSuccessMessage("Pilihan mata kuliah berhasil disimpan!");
      setShowSuccessModal(true);
    } catch (error) {
      setSuccessMessage("Terjadi kesalahan saat menyimpan data.");
      setShowSuccessModal(true);
    }
  };

  const confirmReset = async () => {
    try {
      await axios.delete("/api/assesment/set");
      setSelectedMatkul([]); // reset state di frontend juga
      setSuccessMessage("Semua pilihan berhasil direset!");
      setShowSuccessModal(true);
    } catch (error) {
      setSuccessMessage("Terjadi kesalahan saat mereset data.");
      setShowSuccessModal(true);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Urutkan berdasarkan nomor_plo numerik
  const sortedData = [...matkulList].sort(
    (a, b) => Number(a.nomor_plo) - Number(b.nomor_plo)
  );

  return (
    <div className="pl-8 pr-8 pt-12 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        📚 Daftar Mata Kuliah Assessment Plan per PLO
      </h1>

      {sortedData.map((plo) => (
        <div key={plo.plo_id} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">
            PLO {plo.nomor_plo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {plo.matkul.map((matkul) => (
              <label
                key={`${plo.plo_id}-${matkul.matkul_id}`}
                className="flex items-center gap-3 bg-white shadow-sm rounded-lg p-4 border hover:border-blue-400 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked(plo.plo_id, matkul.matkul_id)}
                  onChange={(e) =>
                    handleMatkulSelection(e, plo.plo_id, matkul.matkul_id)
                  }
                />
                <div
                  className={`w-5 h-5 border-2 rounded-md ${
                    isChecked(plo.plo_id, matkul.matkul_id)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-400"
                  } flex items-center justify-center`}
                >
                  {isChecked(plo.plo_id, matkul.matkul_id) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="font-medium">{matkul.nama_matkul}</span> (
                  {matkul.kode_matkul}) - {matkul.jumlah_sks} SKS
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-start mt-6 gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-md transition-all"
        >
          Simpan
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md shadow-md transition-all"
        >
          Reset
        </button>
      </div>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      <ModalDelete
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmReset}
        title="Reset Pilihan?"
        description="Semua pilihan mata kuliah assessment akan dihapus. Anda yakin ingin mereset?"
      />
    </div>
  );
};

export default AssessmentSet;
