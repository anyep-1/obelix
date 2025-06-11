"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import FileUploader from "@/app/components/planCom/FileUploader";
import Alert from "@/app/components/utilities/Alert";

const InputQuestion = () => {
  const [questionData, setQuestionData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skippedItems, setSkippedItems] = useState([]);
  const fileInputRef = useRef(null);

  const expectedHeaders = ["nama_question", "clo", "tools", "nama_matkul"];

  const handleSubmit = async () => {
    if (!questionData.length) {
      setError("Data kosong. Upload file terlebih dahulu.");
      setSuccess("");
      setSkippedItems([]);
      return;
    }

    try {
      const res = await axios.post("/api/input/question", questionData);
      if (res.status === 201) {
        const { inserted, skipped, skippedItems } = res.data;
        let message = `✅ ${inserted} pertanyaan berhasil ditambahkan.`;
        if (skipped > 0) {
          message += `\n❌ ${skipped} pertanyaan dilewati.`;
        }

        setSuccess(message);
        setError("");
        setSkippedItems(skippedItems || []);
        setQuestionData([]);
        if (fileInputRef.current) fileInputRef.current.value = null;
      } else {
        setError(res.data?.error || "Gagal mengirim data.");
        setSuccess("");
        setSkippedItems([]);
      }
    } catch (err) {
      console.error("ERR:", err?.response?.data || err.message);
      setError("Kesalahan saat mengirim data.");
      setSuccess("");
      setSkippedItems([]);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess("");
    // ⛔ Jangan reset skippedItems agar tetap ditampilkan
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
        <Alert.SuccessAlert message={success} onClose={handleCloseSuccess} />
      )}

      {skippedItems.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-800">
          <h4 className="font-semibold mb-2">Data yang tidak masuk:</h4>
          <ul className="list-disc list-inside space-y-1">
            {skippedItems.map((item, index) => (
              <li key={index}>
                <span className="font-medium text-gray-800">
                  {item.item?.nama_question || "Pertanyaan tidak diketahui"}
                </span>{" "}
                — {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InputQuestion;
