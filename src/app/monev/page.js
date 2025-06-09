"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableForm from "../components/doCom/ReuseableForm";
import { Card } from "flowbite-react";
import ModalSuccess from "../components/utilities/ModalSuccess"; // pastikan path sesuai

const Monev = () => {
  const [formData, setFormData] = useState({
    programStudi: "",
    tanggalRTM: "",
    tanggalMonev: "",
    evaluasiPeriode: "",
    tujuanEvaluasi: "",
    metodeEvaluasi: "",
  });

  const [userTujuanId, setUserTujuanId] = useState("");
  const [userList, setUserList] = useState([]);
  const [matkulList, setMatkulList] = useState([]);
  const [selectedMatkulId, setSelectedMatkulId] = useState("");

  const [rtData, setRtData] = useState([
    {
      deskripsiRT: "",
      statusImplementasi: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      analisisKetercapaian: "",
      kendala: "",
      solusi: "",
    },
  ]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  // State modal success
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fetch users (dosen)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get("/api/users");
        const filtered = res.data.filter(
          (user) =>
            user.role.toLowerCase() === "dosenampu" ||
            user.role.toLowerCase() === "dosenkoor"
        );
        setUserList(filtered);
        setErrorUsers(null);
      } catch (err) {
        setErrorUsers("Gagal mengambil data dosen");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch mata kuliah
  useEffect(() => {
    const fetchMatkul = async () => {
      try {
        const res = await axios.get("/api/matkul");
        setMatkulList(res.data);
      } catch (err) {
        console.error("Gagal mengambil data matkul", err);
      }
    };
    fetchMatkul();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "userTujuanId") setUserTujuanId(value);
    else if (name === "matkulId") setSelectedMatkulId(value);
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      formData,
      userTujuanId,
      matkulId: selectedMatkulId,
      rtData,
    };

    try {
      await axios.post("/api/monev", payload);
      setIsSuccessModalOpen(true);

      // Reset form ke awal
      setFormData({
        programStudi: "",
        tanggalRTM: "",
        tanggalMonev: "",
        evaluasiPeriode: "",
        tujuanEvaluasi: "",
        metodeEvaluasi: "",
      });
      setUserTujuanId("");
      setSelectedMatkulId("");
      setRtData([
        {
          deskripsiRT: "",
          statusImplementasi: "",
          tanggalMulai: "",
          tanggalSelesai: "",
          analisisKetercapaian: "",
          kendala: "",
          solusi: "",
        },
      ]);
    } catch (err) {
      alert("Gagal menyimpan data");
      console.error(err);
    }
  };

  const fields = [
    {
      type: "select",
      name: "userTujuanId",
      label: "Dosen Tujuan",
      required: true,
      options: userList.map((user) => ({
        value: user.user_id,
        label: user.nama,
      })),
      disabled: loadingUsers || errorUsers,
    },
    {
      type: "select",
      name: "matkulId",
      label: "Mata Kuliah",
      required: true,
      options: matkulList.map((matkul) => ({
        value: matkul.matkul_id,
        label: matkul.nama_matkul,
      })),
    },
    {
      type: "text",
      name: "programStudi",
      label: "Program Studi",
      placeholder: "cth: Teknik Komputer",
      required: true,
    },
    {
      type: "date",
      name: "tanggalRTM",
      label: "Tanggal RTM",
      required: true,
    },
    {
      type: "date",
      name: "tanggalMonev",
      label: "Tanggal Monev",
      required: true,
    },
    {
      type: "text",
      name: "evaluasiPeriode",
      label: "Periode Evaluasi",
      placeholder: "cth: Ganjil 2021/2022",
      required: true,
    },
    {
      type: "textarea",
      name: "tujuanEvaluasi",
      label: "Tujuan Evaluasi",
      required: true,
    },
    {
      type: "textarea",
      name: "metodeEvaluasi",
      label: "Metode Evaluasi",
      required: true,
    },
    {
      type: "rt-list",
      name: "rtData",
      label: "Rencana Tindak",
      value: rtData,
      onChange: (index, key, value) => {
        const updated = [...rtData];
        updated[index] = { ...updated[index], [key]: value };
        setRtData(updated);
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <Card className="w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6">
          Form Monitoring & Evaluasi
        </h1>

        <ReusableForm
          fields={fields}
          data={{ ...formData, userTujuanId, matkulId: selectedMatkulId }}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() =>
              setRtData([
                ...rtData,
                {
                  deskripsiRT: "",
                  statusImplementasi: "",
                  tanggalMulai: "",
                  tanggalSelesai: "",
                  analisisKetercapaian: "",
                  kendala: "",
                  solusi: "",
                },
              ])
            }
            className="text-blue-600 hover:underline"
          >
            + Tambah Rencana Tindak
          </button>
        </div>
      </Card>

      {/* Modal Success */}
      <ModalSuccess
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Data berhasil disimpan"
      />
    </div>
  );
};

export default Monev;
