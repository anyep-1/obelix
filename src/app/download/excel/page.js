// app/download/excel/page.js
"use client";

import { DownloadIcon } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Template Nilai Mahasiswa",
    description: "Format untuk input nilai mahasiswa ke dalam sistem.",
    fileUrl: "/templates/templateNilai.xlsx",
  },
  {
    id: 2,
    name: "Template Data Dosen",
    description: "Format untuk input data dosen",
    fileUrl: "/templates/templateDosen.xlsx",
  },
  {
    id: 3,
    name: "Template Data Kelas Dosen",
    description: "Format untuk input data kelas dosen.",
    fileUrl: "/templates/templateKelasdosen.xlsx",
  },
  {
    id: 4,
    name: "Template Data Mahasiswa",
    description: "Format untuk input data mahasiswa",
    fileUrl: "/templates/templateMahasiswa.xlsx",
  },
  {
    id: 5,
    name: "Template Data Kelas Mahasiswa",
    description: "Format untuk input data kelas mahasiswa",
    fileUrl: "/templates/templateKelasmahasiswa.xlsx",
  },
  {
    id: 6,
    name: "Template Data Question",
    description:
      "Format untuk input data question yang dijadikan bahan assesment plan",
    fileUrl: "/templates/templateQuestion.xlsx",
  },
  {
    id: 7,
    name: "Template Data Tools Assesment",
    description:
      "Format untuk input data tools yang dipakai dalam assesment plan",
    fileUrl: "/templates/templateToolsassesment.xlsx",
  },
];

const ExcelTemplate = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Download Template Excel</h1>
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
