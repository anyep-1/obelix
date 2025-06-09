"use client";

import ReusableForm from "@/app/components/doCom/ReuseableForm";
import { useState, useEffect } from "react";
import axios from "axios";
import ModalSuccess from "@/app/components/utilities/ModalSuccess";

const initialFormData = {
  kurikulum: "",
  matkul: "",
  plo: "",
  pi: "",
  ta_semester: "",
  dosen_pengampu: [],
  objek_pengukuran: "",
  kategori: [
    { level: "Exemplary", nilai: 4, min: 80, max: 100, deskripsi: "" },
    { level: "Satisfactory", nilai: 3, min: 70, max: 79, deskripsi: "" },
    { level: "Developing", nilai: 2, min: 60, max: 69, deskripsi: "" },
    { level: "Unsatisfactory", nilai: 1, min: 0, max: 59, deskripsi: "" },
  ],
};

const SetRubrik = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [options, setOptions] = useState({
    kurikulum: [],
    matkul: [],
    plo: [],
    pi: [],
    dosen: [],
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchKurikulum = async () => {
      try {
        const res = await fetch("/api/input/rubrik");
        const data = await res.json();
        setOptions((prev) => ({ ...prev, kurikulum: data.kurikulum }));
      } catch (error) {
        console.error("Error fetching kurikulum:", error);
      }
    };
    fetchKurikulum();
  }, []);

  const fetchMatkul = async (tahunKurikulum) => {
    try {
      const res = await fetch(
        `/api/input/rubrik?kurikulum=${encodeURIComponent(tahunKurikulum)}`
      );
      const data = await res.json();
      setOptions((prev) => ({
        ...prev,
        matkul: data.matkul,
        plo: [],
        pi: [],
        dosen: [],
      }));
      setFormData((prev) => ({
        ...prev,
        matkul: "",
        plo: "",
        pi: "",
        dosen_pengampu: [],
      }));
    } catch (error) {
      console.error("Error fetching matkul:", error);
    }
  };

  const fetchPloAndPi = async (namaMatkul) => {
    try {
      const res = await fetch(
        `/api/input/rubrik?matkul=${encodeURIComponent(namaMatkul)}`
      );
      const data = await res.json();
      setOptions((prev) => ({
        ...prev,
        plo: data.plo,
        pi: data.pi,
        dosen: data.dosen,
      }));
      setFormData((prev) => ({
        ...prev,
        plo: "",
        pi: "",
        dosen_pengampu: [],
      }));
    } catch (error) {
      console.error("Error fetching PLO, PI, dan dosen:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "kategori") {
      setFormData((prev) => ({ ...prev, kategori: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "kurikulum") {
      const selected = options.kurikulum.find(
        (k) => k.kurikulum_id.toString() === value.toString()
      );
      if (selected) fetchMatkul(selected.tahun_kurikulum);
    } else if (name === "matkul") {
      const selected = options.matkul.find(
        (m) => m.matkul_id.toString() === value.toString()
      );
      if (selected) fetchPloAndPi(selected.nama_matkul);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      dosen_pengampu: checked
        ? [...prev.dosen_pengampu, value.toString()]
        : prev.dosen_pengampu.filter((item) => item !== value.toString()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/templateRubrik/saveTemplate",
        formData
      );

      if (response.status !== 200) {
        throw new Error("Gagal menyimpan template rubrik");
      }

      setSubmittedData(response.data.template);
      setFormData(initialFormData);
      setOptions((prev) => ({
        ...prev,
        matkul: [],
        plo: [],
        pi: [],
        dosen: [],
      }));

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saat menyimpan template rubrik:", error);
      alert("Terjadi kesalahan saat menyimpan template rubrik.");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const formFields = [
    {
      name: "kurikulum",
      label: "Tahun Kurikulum",
      type: "select",
      options: options.kurikulum.map((k) => ({
        value: k.kurikulum_id,
        label: k.tahun_kurikulum,
      })),
      required: true,
    },
    {
      name: "matkul",
      label: "Mata Kuliah",
      type: "select",
      options: options.matkul.map((m) => ({
        value: m.matkul_id,
        label: m.nama_matkul,
      })),
      required: true,
      disabled: !formData.kurikulum,
    },
    {
      name: "plo",
      label: "PLO",
      type: "select",
      options: options.plo.map((p) => ({
        value: p.plo_id,
        label: `PLO ${p.nomor_plo}`,
      })),
      required: true,
      disabled: !formData.matkul,
    },
    {
      name: "pi",
      label: "PI",
      type: "select",
      options: options.pi.map((pi) => ({
        value: pi.pi_id,
        label: `PI ${pi.nomor_pi}`,
      })),
      required: true,
      disabled: !formData.matkul,
    },
    {
      name: "dosen_pengampu",
      label: "Dosen Pengampu",
      type: "checkboxGroup",
      options: options.dosen.map((dosen) => ({
        value: dosen.dosen_id,
        label: dosen.nama_dosen,
      })),
      onCheckboxChange: handleCheckboxChange,
    },
    {
      name: "ta_semester",
      label: "TA-Semester",
      type: "text",
      required: true,
    },
    {
      name: "objek_pengukuran",
      label: "Objek Pengukuran",
      type: "textarea",
      required: true,
    },
    {
      name: "kategori",
      type: "kategori-input",
      required: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Input Rubrik Penilaian</h2>

      <div className="bg-white p-6 rounded shadow-md">
        <ReusableForm
          fields={formFields}
          data={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>

      <ModalSuccess
        isOpen={showSuccessModal}
        message="Template rubrik berhasil disimpan!"
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SetRubrik;
