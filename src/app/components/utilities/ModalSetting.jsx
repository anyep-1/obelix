"use client";

import React, { useState, useEffect } from "react";

const ModalSetting = ({ isOpen, onClose, nilaiMinimum, onSave }) => {
  const [inputValue, setInputValue] = useState(nilaiMinimum);

  useEffect(() => {
    setInputValue(nilaiMinimum);
  }, [nilaiMinimum]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 4) {
      onSave(parsed);
    } else {
      alert("Nilai minimum harus angka antara 0 dan 4");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Atur Nilai Minimum</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            step="0.1"
            min="0"
            max="4"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSetting;
