"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const FormInputPLO = ({ onClose, onDataSaved }) => {
  const [namaPLO, setNamaPLO] = useState("");
  const [noUrut, setNoUrut] = useState("");
  const [kurikulumId, setKurikulumId] = useState("");
  const [message, setMessage] = useState("");
  const [kurikulumOptions, setKurikulumOptions] = useState([]);
  const [profilLulusan, setProfilLulusan] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  useEffect(() => {
    fetchKurikulumOptions();
  }, []);

  const handleCheckboxChange = (profilId) => {
    setSelectedProfiles((prevSelected) => {
      if (prevSelected.includes(profilId)) {
        return prevSelected.filter((id) => id !== profilId);
      } else {
        return [...prevSelected, profilId];
      }
    });
  };

  const fetchKurikulumOptions = async () => {
    try {
      const response = await axios.get("/api/kurikulum");
      setKurikulumOptions(response.data);
    } catch (error) {
      console.error("Error fetching kurikulum:", error);
      setMessage("Gagal mengambil data kurikulum.");
    }
  };

  const fetchProfilLulusan = async (kurikulumId) => {
    try {
      const response = await axios.get(
        `/api/profillulusan?kurikulumId=${kurikulumId}`
      );
      setProfilLulusan(response.data);
    } catch (error) {
      console.error("Error fetching profil lulusan:", error);
      setMessage("Gagal mengambil data profil lulusan.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const kurikulumIdInt = parseInt(kurikulumId, 10);
    const noUrutStr = noUrut.trim();

    try {
      const responsePLO = await axios.post("/api/plo", {
        namaPLO,
        no_urut: noUrutStr,
        kurikulumId: kurikulumIdInt,
      });

      const ploId = responsePLO.data.plo_id;

      await Promise.all(
        selectedProfiles.map((profilId) =>
          axios.post("/api/plo_profil", { ploId, profilId })
        )
      );

      setMessage("Data PLO berhasil disimpan!");
      setNamaPLO("");
      setNoUrut("");
      setKurikulumId("");
      setSelectedProfiles([]);
      onDataSaved();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setMessage("Gagal menyimpan data.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-4">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Input Data PLO
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
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tahun Kurikulum
              </label>
              <select
                value={kurikulumId}
                onChange={(e) => {
                  setKurikulumId(e.target.value);
                  fetchProfilLulusan(e.target.value);
                }}
                required
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              >
                <option value="">Pilih kurikulum</option>
                {kurikulumOptions.map((kurikulum) => (
                  <option
                    key={kurikulum.kurikulum_id}
                    value={kurikulum.kurikulum_id}
                  >
                    {kurikulum.tahun_kurikulum}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nomor Urut PLO
              </label>
              <input
                type="number"
                value={noUrut}
                onChange={(e) => setNoUrut(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Nomor PLO"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nama PLO
              </label>
              <input
                type="text"
                value={namaPLO}
                onChange={(e) => setNamaPLO(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Deskripsi PLO"
              />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Pilih Profil Lulusan
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {profilLulusan.map((profil) => (
                  <div key={profil.profil_id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`profil-${profil.profil_id}`}
                      value={profil.profil_id}
                      checked={selectedProfiles.includes(profil.profil_id)}
                      onChange={() => handleCheckboxChange(profil.profil_id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`profil-${profil.profil_id}`}
                      className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                    >
                      {profil.deskripsi_profil}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-600">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700"
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

export default FormInputPLO;
