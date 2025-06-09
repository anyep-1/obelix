"use client";

import React, { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import Alert from "@/app/components/utilities/Alert";
import FileUploader from "@/app/components/planCom/FileUploader";

const InputDosenKelas = () => {
  const [dosenData, setDosenData] = useState([]);
  const [kelasDosenData, setKelasDosenData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dosenFileRef = useRef(null);
  const kelasFileRef = useRef(null);

  const expectedDosenHeaders = ["nama_dosen", "kode_dosen"];
  const expectedKelasDosenHeaders = [
    "tahun_akademik",
    "kelas",
    "nama_dosen",
    "nama_matkul",
  ];

  const handleSubmit = async (data, url, successMsg, clearData, refInput) => {
    if (!data.length) {
      setError("Data kosong. Upload file terlebih dahulu.");
      setSuccess("");
      return;
    }
    try {
      const res = await axios.post(url, data);
      if (res.status === 201) {
        setSuccess(successMsg);
        setError("");
        clearData([]);
        if (refInput.current) refInput.current.value = "";
      } else {
        setError(res.data.error || "Gagal mengirim data.");
        setSuccess("");
      }
    } catch {
      setError("Kesalahan saat mengirim data.");
      setSuccess("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upload Dosen & Kelas Dosen
      </h2>
      <div className="mb-8 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Dosen</h3>
        <FileUploader
          label="Pilih CSV atau Excel (.xlsx)"
          ref={dosenFileRef}
          expectedHeaders={expectedDosenHeaders}
          setData={setDosenData}
          onError={setError}
          borderColor="border-blue-400"
          textColor="text-blue-700"
          iconColor="text-blue-500"
          bgHoverColor="hover:bg-blue-50"
        />
        <button
          onClick={() =>
            handleSubmit(
              dosenData,
              "/api/input/dosen",
              "Dosen berhasil ditambahkan!",
              setDosenData,
              dosenFileRef
            )
          }
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Dosen
        </button>
      </div>

      <div className="mb-8 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Kelas Dosen</h3>
        <FileUploader
          label="Pilih CSV atau Excel (.xlsx)"
          ref={kelasFileRef}
          expectedHeaders={expectedKelasDosenHeaders}
          setData={setKelasDosenData}
          onError={setError}
          borderColor="border-green-400"
          textColor="text-green-700"
          iconColor="text-green-500"
          bgHoverColor="hover:bg-green-50"
        />
        <button
          onClick={() =>
            handleSubmit(
              kelasDosenData,
              "/api/input/kelasDosen",
              "Kelas dosen berhasil ditambahkan!",
              setKelasDosenData,
              kelasFileRef
            )
          }
          className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Submit Kelas Dosen
        </button>
      </div>

      {error && (
        <Alert.ErrorAlert message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert.SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}
    </div>
  );
};

export default InputDosenKelas;
