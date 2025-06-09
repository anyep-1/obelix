"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ReusableForm from "@/app/components/doCom/ReuseableForm";
import ModalSuccess from "@/app/components/utilities/ModalSuccess";

const InputPortofolio = () => {
  const [kurikulumList, setKurikulumList] = useState([]);
  const [matkulList, setMatkulList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal control

  const [form, setForm] = useState({
    kurikulum_id: "",
    tahun_akademik: "",
    matkul_id: "",
    kelas_id: "",
    google_drive_link: "",
  });

  const [status, setStatus] = useState("");

  // Fetch kurikulum & kelas
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [kurikulumRes, kelasRes] = await Promise.all([
          axios.get("/api/kurikulum"),
          axios.get("/api/kelas"),
        ]);
        setKurikulumList(
          kurikulumRes.data.map((k) => ({
            value: k.kurikulum_id,
            label: k.tahun_kurikulum,
          }))
        );
        setKelasList(
          kelasRes.data
            .sort((a, b) =>
              a.kode_kelas.localeCompare(b.kode_kelas, undefined, {
                numeric: true,
              })
            )
            .map((k) => ({
              value: k.kelas_id,
              label: k.kode_kelas,
            }))
        );
      } catch (err) {
        console.error("Gagal fetch:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch matkul berdasarkan kurikulum
  useEffect(() => {
    const fetchMatkul = async () => {
      if (!form.kurikulum_id) {
        setMatkulList([]);
        return;
      }
      try {
        const res = await axios.get(
          `/api/matkul?kurikulumId=${form.kurikulum_id}`
        );
        setMatkulList(
          res.data.map((m) => ({
            value: m.matkul_id,
            label: m.nama_matkul,
          }))
        );
      } catch (err) {
        console.error("Gagal fetch matkul:", err);
      }
    };
    fetchMatkul();
  }, [form.kurikulum_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/input/portofolio", form);
      setStatus("Berhasil disimpan");
      setForm({
        kurikulum_id: "",
        tahun_akademik: "",
        matkul_id: "",
        kelas_id: "",
        google_drive_link: "",
      });
      setMatkulList([]);
      setShowSuccessModal(true); // ✅ Tampilkan modal
    } catch (err) {
      console.error(err);
      setStatus("Gagal menyimpan");
    }
  };

  const fields = [
    {
      type: "select",
      name: "kurikulum_id",
      label: "Tahun Kurikulum",
      required: true,
      disabled: false,
      options: kurikulumList,
    },
    {
      type: "text",
      name: "tahun_akademik",
      label: "Tahun Akademik",
      required: true,
    },
    {
      type: "select",
      name: "matkul_id",
      label: "Mata Kuliah",
      required: true,
      disabled: !form.kurikulum_id,
      options: matkulList,
    },
    {
      type: "select",
      name: "kelas_id",
      label: "Kelas",
      required: true,
      disabled: false,
      options: kelasList,
    },
    {
      type: "text",
      name: "google_drive_link",
      label: "Link Google Drive",
      required: true,
    },
  ];

  return (
    <div className="max-w-6xl ml-8 p-4">
      <h2 className="text-xl font-bold mb-4">Input Portofolio Mata Kuliah</h2>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <ReusableForm
          fields={fields}
          data={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Portofolio berhasil disimpan!"
      />
    </div>
  );
};

export default InputPortofolio;
