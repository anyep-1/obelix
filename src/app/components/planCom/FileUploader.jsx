"use client";
import React, { forwardRef } from "react";
import { UploadCloud } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const FileUploader = forwardRef(
  (
    {
      label = "Pilih CSV atau Excel",
      expectedHeaders = [],
      setData,
      onError,
      borderColor = "border-blue-400",
      textColor = "text-blue-700",
      iconColor = "text-blue-500",
      bgHoverColor = "hover:bg-blue-50",
      acceptedTypes = ".csv, .xlsx",
    },
    ref
  ) => {
    const parseExcel = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        const headers = Object.keys(jsonData[0] || {});
        if (!expectedHeaders.every((h) => headers.includes(h))) {
          onError(`Invalid headers. Expected: ${expectedHeaders.join(", ")}`);
          return;
        }
        onError("");
        setData(jsonData);
      };
      reader.onerror = () => onError("Gagal membaca file Excel.");
      reader.readAsArrayBuffer(file);
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const ext = file.name.split(".").pop().toLowerCase();

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data, errors, meta }) => {
            if (errors.length) {
              onError("Error parsing CSV file.");
              return;
            }
            if (!expectedHeaders.every((h) => meta.fields.includes(h))) {
              onError(
                `Invalid headers. Expected: ${expectedHeaders.join(", ")}`
              );
              return;
            }
            onError("");
            setData(data);
          },
        });
      } else if (ext === "xlsx") {
        parseExcel(file);
      } else {
        onError("Gunakan file CSV atau Excel (.xlsx) saja.");
      }
    };

    return (
      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed ${borderColor} py-8 rounded-lg cursor-pointer ${bgHoverColor} transition`}
      >
        <UploadCloud className={`w-8 h-8 ${iconColor} mb-2`} />
        <span className={`text-sm font-medium ${textColor}`}>
          {ref?.current?.files?.[0]?.name || label}
        </span>
        <input
          ref={ref}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    );
  }
);

export default FileUploader;
