"use client";

import { useEffect } from "react";

const ModalDelete = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Data",
  message = "Apakah Anda yakin ingin menghapus data ini?",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow dark:bg-gray-700 max-w-md w-full p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="text-center">
          <svg
            className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-white">
            {title}
          </h3>
          <p className="mb-5 text-gray-500 dark:text-gray-300">{message}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-800 rounded-lg text-sm font-medium"
            >
              Ya, Hapus
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-medium"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
