import { useState, useEffect } from "react";
import axios from "axios";

const FormPI = ({ isVisible, onClose, fetchDataPI, onDataSaved }) => {
  const [deskripsiPeforma, setDeskripsiPeforma] = useState("");
  const [noUrutPI, setNoUrutPI] = useState("");
  const [selectedPLO, setSelectedPLO] = useState("");
  const [selectedKurikulum, setSelectedKurikulum] = useState("");
  const [ploOptions, setPloOptions] = useState([]);
  const [kurikulumOptions, setKurikulumOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchKurikulum = async () => {
      try {
        const response = await axios.get("/api/kurikulum");
        setKurikulumOptions(response.data);
      } catch (error) {
        console.error("Error fetching kurikulum data:", error);
      }
    };
    fetchKurikulum();
  }, []);

  useEffect(() => {
    if (!selectedKurikulum) {
      setPloOptions([]);
      setSelectedPLO("");
      return;
    }
    const fetchPLOs = async () => {
      try {
        const response = await axios.get(
          `/api/plo?kurikulumId=${selectedKurikulum}`
        );
        setPloOptions(response.data);
      } catch (error) {
        console.error("Error fetching PLO data:", error);
      }
    };
    fetchPLOs();
  }, [selectedKurikulum]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!noUrutPI.trim() || !deskripsiPeforma.trim() || !selectedPLO) {
      setErrorMessage("Nomor urut, deskripsi PI dan PLO wajib diisi!");
      return;
    }

    try {
      await axios.post("/api/pi", {
        no_urut: noUrutPI.trim(),
        deskripsiPi: deskripsiPeforma.trim(),
        ploId: selectedPLO,
      });

      // Reset form
      setSelectedKurikulum("");
      setPloOptions([]);
      setSelectedPLO("");
      setDeskripsiPeforma("");
      setNoUrutPI("");

      fetchDataPI();
      if (onDataSaved) {
        onDataSaved();
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Gagal menyimpan data PI, silakan coba lagi.");
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden bg-gray-600 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Input Data Peforma Indikator
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal body / form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-5">
            {errorMessage && (
              <div className="mb-4 text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="kurikulum"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tahun Kurikulum
                </label>
                <select
                  id="kurikulum"
                  value={selectedKurikulum}
                  onChange={(e) => setSelectedKurikulum(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                    dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="" disabled>
                    Pilih Tahun Kurikulum
                  </option>
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

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="plo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Pilih PLO
                </label>
                <select
                  id="plo"
                  value={selectedPLO}
                  onChange={(e) => setSelectedPLO(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                    dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                  disabled={!selectedKurikulum}
                >
                  <option value="" disabled>
                    Pilih PLO
                  </option>
                  {ploOptions.map((plo) => (
                    <option key={plo.plo_id} value={plo.plo_id}>
                      PLO {plo.nomor_plo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="noUrutPI"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nomor PI (contoh: 1.1)
                </label>
                <input
                  id="noUrutPI"
                  type="text"
                  value={noUrutPI}
                  onChange={(e) => setNoUrutPI(e.target.value)}
                  placeholder="Nomor urut PI"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                    dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="deskripsiPeforma"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Deskripsi
                </label>
                <input
                  id="deskripsiPeforma"
                  type="text"
                  placeholder="Deskripsi Peforma Indikator"
                  value={deskripsiPeforma}
                  onChange={(e) => setDeskripsiPeforma(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                    dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
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

export default FormPI;
