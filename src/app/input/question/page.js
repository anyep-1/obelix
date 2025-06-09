"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import FileUploader from "@/app/components/planCom/FileUploader";
import Alert from "@/app/components/utilities/Alert";

const InputQuestion = () => {
  const [questionData, setQuestionData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const expectedHeaders = ["nama_question", "clo", "tools", "nama_matkul"];

  const handleSubmit = async () => {
    if (!questionData.length) {
      setError("Data kosong. Upload file terlebih dahulu.");
      setSuccess("");
      return;
    }
    try {
      const res = await axios.post("/api/input/question", questionData);
      if (res.status === 201) {
        setSuccess("Pertanyaan berhasil ditambahkan!");
        setError("");
        setQuestionData([]);
        if (fileInputRef.current) fileInputRef.current.value = null;
      } else {
        setError(res.data?.error || "Gagal mengirim data.");
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
        Upload Pertanyaan (Question)
      </h2>

      <div className="mb-8 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Question</h3>

        <FileUploader
          ref={fileInputRef}
          label="Pilih CSV atau Excel"
          expectedHeaders={expectedHeaders}
          setData={setQuestionData}
          onError={setError}
          borderColor="border-purple-400"
          textColor="text-purple-700"
          iconColor="text-purple-500"
          bgHoverColor="hover:bg-purple-50"
          acceptedTypes=".csv, .xlsx"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Submit Pertanyaan
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

export default InputQuestion;
