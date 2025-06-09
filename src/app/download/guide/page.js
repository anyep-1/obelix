// app/download/excel/page.js
"use client";

import { DownloadIcon } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Buku Panduan Website OBELix",
    description: "Panduan User untuk mengoperasikan website",
    fileUrl: "/other/GuideBook.pdf",
  },
];

const ExcelTemplate = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Download Buku Panduan</h1>
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
          >
            <div>
              <h2 className="text-lg font-semibold">{template.name}</h2>
              <p className="text-gray-600 text-sm">{template.description}</p>
            </div>
            <a
              href={template.fileUrl}
              download
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExcelTemplate;
