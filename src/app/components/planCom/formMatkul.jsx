import { useState, useEffect } from "react";
import axios from "axios";

const FormInputMatkul = ({ onClose, fetchDataMatkul, onDataSaved }) => {
  const [namaMatkul, setNamaMatkul] = useState("");
  const [kodeMatkul, setKodeMatkul] = useState("");
  const [jumlahSKS, setJumlahSKS] = useState("");
  const [kurikulumId, setKurikulumId] = useState("");
  const [kurikulumOptions, setKurikulumOptions] = useState([]);
  const [tingkat, setTingkat] = useState("");
  const [semester, setSemester] = useState("");
  const [message, setMessage] = useState("");

  const fetchKurikulumOptions = async () => {
    try {
      const response = await axios.get("/api/kurikulum");
      setKurikulumOptions(response.data);
    } catch (error) {
      console.error("Error fetching kurikulum options:", error);
    }
  };

  useEffect(() => {
    fetchKurikulumOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jumlahSKSInt = parseInt(jumlahSKS, 10);
    const kurikulumIdInt = parseInt(kurikulumId, 10);

    if (
      !namaMatkul ||
      !kodeMatkul ||
      !jumlahSKS ||
      !kurikulumId ||
      !tingkat ||
      !semester
    ) {
      setMessage("Semua field harus diisi!");
      return;
    }

    try {
      await axios.post("/api/matkul", {
        namaMatkul,
        kodeMatkul,
        jumlahSKS: jumlahSKSInt,
        kurikulumId: kurikulumIdInt,
        tingkat,
        semester,
      });

      setNamaMatkul("");
      setKodeMatkul("");
      setJumlahSKS("");
      setKurikulumId("");
      setTingkat("");
      setSemester("");
      setMessage("Mata Kuliah berhasil diinput!");
      fetchDataMatkul();
      if (onDataSaved) {
        onDataSaved();
      }
      onClose();
    } catch (error) {
      console.error("Error saving matkul data:", error);
      setMessage("Tidak berhasil melakukan input.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white dark:bg-gray-800 pt-4 px-6 pb-6 rounded-lg shadow-md w-full max-w-3xl">
        <div className="flex items-center justify-between px-4 py-2 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 rounded-t">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Input Data Mata Kuliah
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Tahun Kurikulum */}
            <div>
              <label
                htmlFor="kurikulumSelect"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tahun Kurikulum
              </label>
              <select
                id="kurikulumSelect"
                value={kurikulumId}
                onChange={(e) => setKurikulumId(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Pilih tahun kurikulum</option>
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

            {/* Nama Matkul */}
            <div>
              <label
                htmlFor="namaMatkul"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama Mata Kuliah
              </label>
              <input
                type="text"
                id="namaMatkul"
                placeholder="Nama Mata Kuliah"
                value={namaMatkul}
                onChange={(e) => setNamaMatkul(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Kode Matkul */}
            <div>
              <label
                htmlFor="kodeMatkul"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Kode Mata Kuliah
              </label>
              <input
                type="text"
                id="kodeMatkul"
                placeholder="Kode Mata Kuliah"
                value={kodeMatkul}
                onChange={(e) => setKodeMatkul(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Jumlah SKS */}
            <div>
              <label
                htmlFor="jumlahSKS"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Jumlah SKS
              </label>
              <input
                type="number"
                id="jumlahSKS"
                placeholder="Jumlah SKS"
                value={jumlahSKS}
                onChange={(e) => setJumlahSKS(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Tingkat */}
            <div>
              <label
                htmlFor="tingkat"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tingkat
              </label>
              <select
                id="tingkat"
                value={tingkat}
                onChange={(e) => setTingkat(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Pilih Tingkat</option>
                <option value="Tingkat 1">Tingkat 1</option>
                <option value="Tingkat 2">Tingkat 2</option>
                <option value="Tingkat 3">Tingkat 3</option>
                <option value="Tingkat 4">Tingkat 4</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label
                htmlFor="semester"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Pilih Semester</option>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          {/* Tombol Aksi */}
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
  );
};

export default FormInputMatkul;
