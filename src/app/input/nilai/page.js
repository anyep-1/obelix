"use client";

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import Alert from "@/app/components/utilities/Alert"; // pastikan path ini benar

const InputNilaiMahasiswa = () => {
  const [nilaiData, setNilaiData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skippedItems, setSkippedItems] = useState([]);
  const fileInputRef = useRef(null);

  const expectedHeaders = [
    "nim",
    "nama",
    "kode_matkul",
    "nilai",
    "clo",
    "question",
  ];

  const parseExcel = (file, expectedHeaders, setData, setError) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: false,
      });

      const headers = Object.keys(jsonData[0] || {});
      if (!expectedHeaders.every((h) => headers.includes(h))) {
        setError(
          `Header tidak sesuai. Harus mengandung: ${expectedHeaders.join(", ")}`
        );
        return;
      }
      setError("");
      setData(jsonData);
    };
    reader.onerror = () => setError("Gagal membaca file Excel.");
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "xlsx") {
      parseExcel(file, expectedHeaders, setNilaiData, setError);
    } else {
      setError("Gunakan file Excel (.xlsx) saja.");
    }
  };

  const handleSubmit = async () => {
    if (!nilaiData.length) {
      setError("Data kosong. Upload file terlebih dahulu.");
      setSuccess("");
      setSkippedItems([]);
      return;
    }

    try {
      const res = await axios.post("/api/input/nilai", nilaiData);

      if (res.status === 201) {
        const { inserted, skipped, skippedItems } = res.data;
        let message = `✅ ${inserted} nilai berhasil disimpan.`;

        if (skipped > 0) {
          message += `\n❌ ${skipped} nilai dilewati.`;
        }

        setSuccess(message);
        setError("");
        setSkippedItems(skippedItems || []);
        setNilaiData([]);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
      } else {
        setError(res.data?.error || "Gagal mengirim data.");
        setSuccess("");
        setSkippedItems([]);
      }
    } catch (err) {
      console.error("ERR:", err?.response?.data || err.message);
      setError("Terjadi kesalahan saat mengirim data.");
      setSuccess("");
      setSkippedItems([]);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upload Nilai Mahasiswa
      </h2>

      <div className="mb-8 border p-4 rounded-lg shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-semibold mb-3">Data Nilai</h3>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 py-8 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
          <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
          <span className="text-sm text-indigo-700 font-medium">
            {selectedFile ? selectedFile.name : "Pilih file Excel (.xlsx)"}
          </span>
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Submit Nilai
        </button>
      </div>

      {error && (
        <Alert.ErrorAlert message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert.SuccessAlert message={success} onClose={() => setSuccess("")} />
      )}

      {skippedItems.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg text-sm max-h-60 overflow-y-auto">
          <p className="font-semibold mb-2">Data yang tidak masuk:</p>
          <ul className="list-disc pl-5 space-y-1">
            {skippedItems.map((item, index) => (
              <li key={index}>
                <span className="font-medium">NIM:</span> {item.item?.nim} -{" "}
                <span className="italic">{item.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InputNilaiMahasiswa;
