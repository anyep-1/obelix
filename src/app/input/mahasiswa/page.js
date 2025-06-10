"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import FileUploader from "@/app/components/planCom/FileUploader";
import Alert from "@/app/components/utilities/Alert";

const InputMahasiswaKelas = () => {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [kelasMahasiswaData, setKelasMahasiswaData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mahasiswaInputRef = useRef(null);
  const kelasInputRef = useRef(null);

  const expectedMahasiswaHeaders = ["nama", "nim", "kode_kelas"];
  const expectedKelasMahasiswaHeaders = ["kode_kelas"];

  const handleSubmit = async (data, url, successMsg, clearData, inputRef) => {
    if (!data.length) {
      setError("Data kosong. Silakan upload file terlebih dahulu.");
      setSuccess("");
      return;
    }
    try {
      const res = await axios.post(url, data);
      if (res.status === 201) {
        setSuccess(successMsg);
        setError("");
        clearData([]);
        if (inputRef.current) inputRef.current.value = null;
      } else {
        setError(res.data?.error || "Gagal mengirim data.");
        setSuccess("");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim data.");
      setSuccess("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upload Mahasiswa & Kelas Mahasiswa
      </h2>
      {/* Upload Kelas Mahasiswa */}
      <div className="mb-4 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Kelas Mahasiswa</h3>
        <FileUploader
          ref={kelasInputRef}
          label="Pilih CSV atau Excel (.xlsx)"
          expectedHeaders={expectedKelasMahasiswaHeaders}
          setData={setKelasMahasiswaData}
          onError={setError}
          borderColor="border-green-400"
          textColor="text-green-700"
          iconColor="text-green-500"
          bgHoverColor="hover:bg-green-50"
          acceptedTypes=".csv, .xlsx"
        />
        <button
          onClick={() =>
            handleSubmit(
              kelasMahasiswaData,
              "/api/input/kelas",
              "Kelas mahasiswa berhasil ditambahkan!",
              setKelasMahasiswaData,
              kelasInputRef
            )
          }
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Submit Kelas Mahasiswa
        </button>
      </div>
      {/* Upload Mahasiswa */}
      <div className="mb-8 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Mahasiswa</h3>
        <FileUploader
          ref={mahasiswaInputRef}
          label="Pilih CSV atau Excel (.xlsx)"
          expectedHeaders={expectedMahasiswaHeaders}
          setData={setMahasiswaData}
          onError={setError}
          borderColor="border-blue-400"
          textColor="text-blue-700"
          iconColor="text-blue-500"
          bgHoverColor="hover:bg-blue-50"
          acceptedTypes=".csv, .xlsx"
        />
        <button
          onClick={() =>
            handleSubmit(
              mahasiswaData,
              "/api/input/mahasiswa",
              "Mahasiswa berhasil ditambahkan!",
              setMahasiswaData,
              mahasiswaInputRef
            )
          }
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Mahasiswa
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert.ErrorAlert message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert.SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
    </div>
  );
};

export default InputMahasiswaKelas;
