"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import FileUploader from "@/app/components/planCom/FileUploader";
import Alert from "@/app/components/utilities/Alert";

const InputTools = () => {
  const [toolsData, setToolsData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const expectedHeaders = ["nama_tools"];

  // Fungsi parsing Excel dan CSV sudah ada di FileUploader,
  // jadi kita hanya perlu meneruskan props dan handle state error/data

  const handleSubmit = async () => {
    if (toolsData.length === 0) {
      setError("Data kosong. Upload file terlebih dahulu.");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        "/api/input/toolsAssessment",
        toolsData
      );
      if (response.status === 201) {
        setSuccess("Tools berhasil ditambahkan!");
        setError("");
        setToolsData([]);
        if (fileInputRef.current) fileInputRef.current.value = null;
      } else {
        setError(response.data?.error || "Gagal menambahkan tools.");
        setSuccess("");
      }
    } catch {
      setError("Terjadi kesalahan saat menambahkan tools.");
      setSuccess("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upload Tools Assessment
      </h2>

      <div className="mb-8 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Tools</h3>
        <FileUploader
          label="Pilih CSV atau Excel (.xlsx)"
          ref={fileInputRef}
          expectedHeaders={expectedHeaders}
          setData={setToolsData}
          onError={setError}
          borderColor="border-blue-400"
          textColor="text-blue-700"
          iconColor="text-blue-500"
          bgHoverColor="hover:bg-blue-50"
          acceptedTypes=".csv, .xlsx"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Tools
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

export default InputTools;
