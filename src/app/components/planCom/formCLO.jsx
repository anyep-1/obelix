"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const FormCLO = ({ isVisible, onClose, fetchDataCLO, onSuccess }) => {
  const [namaClo, setNamaClo] = useState("");
  const [selectedPlo, setSelectedPlo] = useState("");
  const [selectedPi, setSelectedPi] = useState("");
  const [selectedMatkul, setSelectedMatkul] = useState("");
  const [selectedTahunKurikulum, setSelectedTahunKurikulum] = useState("");
  const [noUrut, setNoUrut] = useState("");

  const [plos, setPlos] = useState([]);
  const [pis, setPis] = useState([]);
  const [matkuls, setMatkuls] = useState([]);
  const [tahunKurikulums, setTahunKurikulums] = useState([]);

  useEffect(() => {
    const fetchTahunKurikulum = async () => {
      try {
        const response = await axios.get("/api/kurikulum");
        setTahunKurikulums(response.data);
      } catch (error) {
        console.error("Error fetching tahun kurikulum:", error);
      }
    };

    fetchTahunKurikulum();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTahunKurikulum) return;

      try {
        const ploResponse = await axios.get(
          `/api/plo?kurikulumId=${selectedTahunKurikulum}`
        );
        setPlos(ploResponse.data);

        const matkulResponse = await axios.get(
          `/api/matkul?kurikulumId=${selectedTahunKurikulum}`
        );
        setMatkuls(matkulResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedTahunKurikulum]);

  useEffect(() => {
    const fetchPiData = async () => {
      if (!selectedTahunKurikulum || !selectedPlo) return;

      try {
        const piResponse = await axios.get(
          `/api/pi?kurikulumId=${selectedTahunKurikulum}&ploId=${selectedPlo}`
        );
        setPis(piResponse.data);
      } catch (error) {
        console.error("Error fetching PI data:", error);
      }
    };

    fetchPiData();
  }, [selectedTahunKurikulum, selectedPlo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/clo", {
        namaClo: namaClo,
        ploId: parseInt(selectedPlo),
        piId: parseInt(selectedPi),
        matkulId: parseInt(selectedMatkul),
        noUrut: noUrut, // string, langsung dikirim tanpa parseInt
      });

      // Reset semua field
      setNamaClo("");
      setSelectedPlo("");
      setSelectedPi("");
      setSelectedMatkul("");
      setSelectedTahunKurikulum("");
      setNoUrut("");

      fetchDataCLO();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating CLO:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div className="relative w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Input Data CLO
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Tahun Kurikulum */}
              <div>
                <label
                  htmlFor="tahunKurikulum"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tahun Kurikulum
                </label>
                <select
                  id="tahunKurikulum"
                  value={selectedTahunKurikulum}
                  onChange={(e) => setSelectedTahunKurikulum(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Pilih Tahun Kurikulum</option>
                  {tahunKurikulums.map((tahun) => (
                    <option key={tahun.kurikulum_id} value={tahun.kurikulum_id}>
                      {tahun.tahun_kurikulum}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama CLO */}
              <div>
                <label
                  htmlFor="namaClo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nama CLO
                </label>
                <input
                  type="text"
                  id="namaClo"
                  placeholder="Deskripsi CLO"
                  value={namaClo}
                  onChange={(e) => setNamaClo(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              {/* No Urut */}
              <div>
                <label
                  htmlFor="noUrut"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nomor CLO
                </label>
                <input
                  type="text"
                  id="noUrut"
                  placeholder="Nomor CLO"
                  value={noUrut}
                  onChange={(e) => setNoUrut(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              {/* PLO */}
              <div>
                <label
                  htmlFor="selectedPlo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  PLO
                </label>
                <select
                  id="selectedPlo"
                  value={selectedPlo}
                  onChange={(e) => setSelectedPlo(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Pilih PLO</option>
                  {plos.map((plo) => (
                    <option key={plo.plo_id} value={plo.plo_id}>
                      PLO {plo.nomor_plo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wrapper grid 2 kolom untuk PI dan Mata Kuliah agar sejajar */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {/* PI */}
                <div>
                  <label
                    htmlFor="selectedPi"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    PI
                  </label>
                  <select
                    id="selectedPi"
                    value={selectedPi}
                    onChange={(e) => setSelectedPi(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Pilih PI</option>
                    {pis.map((pi) => (
                      <option key={pi.pi_id} value={pi.pi_id}>
                        PI {pi.nomor_pi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mata Kuliah */}
                <div>
                  <label
                    htmlFor="selectedMatkul"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mata Kuliah
                  </label>
                  <select
                    id="selectedMatkul"
                    value={selectedMatkul}
                    onChange={(e) => setSelectedMatkul(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Pilih Mata Kuliah</option>
                    {matkuls.map((matkul) => (
                      <option key={matkul.matkul_id} value={matkul.matkul_id}>
                        {matkul.nama_matkul}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tombol submit dan batal */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
        focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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

export default FormCLO;
