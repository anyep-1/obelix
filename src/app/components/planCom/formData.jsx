"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const FormInputProfilLulusan = ({ openModal, onClose, onDataSaved }) => {
  const [tahunKurikulum, setTahunKurikulum] = useState("");
  const [deskripsiProfil, setDeskripsiProfil] = useState([{ label: "" }]);
  const [existingDeskripsi, setExistingDeskripsi] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tahunKurikulum) {
      axios
        .get(`/api/profillulusan?tahun=${tahunKurikulum}`)
        .then((res) => {
          setExistingDeskripsi(res.data?.deskripsiProfil || []);
        })
        .catch(() => {
          setExistingDeskripsi([]);
        });
    }
  }, [tahunKurikulum]);

  const handleDeskripsiChange = (index, value) => {
    const updated = [...deskripsiProfil];
    updated[index].label = value;
    setDeskripsiProfil(updated);
  };

  const handleTambahDeskripsi = () => {
    setDeskripsiProfil([...deskripsiProfil, { label: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tahunKurikulum || deskripsiProfil.some((d) => !d.label.trim())) {
      setError("Tahun kurikulum dan semua deskripsi wajib diisi.");
      return;
    }

    try {
      const combined = [...existingDeskripsi, ...deskripsiProfil];
      await axios.post("/api/profillulusan", {
        tahunKurikulum,
        deskripsiProfil: combined,
      });

      setTahunKurikulum("");
      setDeskripsiProfil([{ label: "" }]);
      setExistingDeskripsi([]);
      setError("");

      onDataSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data.");
    }
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-4">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Input Profil Lulusan
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tahun Kurikulum
              </label>
              <input
                type="text"
                value={tahunKurikulum}
                onChange={(e) => setTahunKurikulum(e.target.value)}
                placeholder="Masukkan tahun kurikulum"
                required
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>

            {existingDeskripsi.length > 0 && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Deskripsi Sebelumnya:
                </label>
                <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
                  {existingDeskripsi.map((item, idx) => (
                    <li key={idx}>{item.label}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tambah Deskripsi Profil Lulusan
              </label>
              {deskripsiProfil.map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={item.label}
                  onChange={(e) => handleDeskripsiChange(idx, e.target.value)}
                  placeholder={`Deskripsi ${idx + 1}`}
                  required
                  className="mb-2 bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              ))}
              <button
                type="button"
                onClick={handleTambahDeskripsi}
                className="text-blue-600 hover:underline text-sm mt-1"
              >
                + Tambah Deskripsi
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-600">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormInputProfilLulusan;
