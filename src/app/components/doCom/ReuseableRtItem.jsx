import React from "react";
import { Label, TextInput, Textarea } from "flowbite-react";

const ReusableRtItem = ({ rt, index, onChange }) => {
  // onChange dipanggil dengan (index, key, value)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(index, name, value);
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50 shadow-sm">
      <Label className="mb-1 block" htmlFor={`deskripsiRT-${index}`}>
        Deskripsi RT
      </Label>
      <TextInput
        id={`deskripsiRT-${index}`}
        name="deskripsiRT"
        value={rt.deskripsiRT || ""}
        onChange={handleInputChange}
        placeholder="Deskripsi RT"
        className="mb-2"
      />

      <Label className="mb-1 block">Status Implementasi</Label>
      <p className="mb-2">{rt.statusImplementasi || "Belum"}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div>
          <Label className="mb-1 block" htmlFor={`tanggalMulai-${index}`}>
            Tanggal Mulai
          </Label>
          <input
            type="date"
            id={`tanggalMulai-${index}`}
            name="tanggalMulai"
            value={rt.tanggalMulai || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <Label className="mb-1 block" htmlFor={`tanggalSelesai-${index}`}>
            Tanggal Selesai
          </Label>
          <input
            type="date"
            id={`tanggalSelesai-${index}`}
            name="tanggalSelesai"
            value={rt.tanggalSelesai || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <Label className="mb-1 block" htmlFor={`analisisKetercapaian-${index}`}>
        Analisis Ketercapaian
      </Label>
      <Textarea
        id={`analisisKetercapaian-${index}`}
        name="analisisKetercapaian"
        value={rt.analisisKetercapaian || ""}
        onChange={handleInputChange}
        placeholder="Masukkan analisis ketercapaian"
        className="mb-2"
        rows={3}
      />

      <Label className="mb-1 block" htmlFor={`kendala-${index}`}>
        Kendala
      </Label>
      <Textarea
        id={`kendala-${index}`}
        name="kendala"
        value={rt.kendala || ""}
        onChange={handleInputChange}
        placeholder="Masukkan kendala"
        className="mb-2"
        rows={3}
      />

      <Label className="mb-1 block" htmlFor={`solusi-${index}`}>
        Solusi
      </Label>
      <Textarea
        id={`solusi-${index}`}
        name="solusi"
        value={rt.solusi || ""}
        onChange={handleInputChange}
        placeholder="Masukkan solusi"
        rows={3}
      />
    </div>
  );
};

export default ReusableRtItem;
