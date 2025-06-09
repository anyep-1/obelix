import { Label, TextInput, Textarea } from "flowbite-react";

const ReusableKategoriInput = ({ kategori, onChange }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mt-6 mb-2">
        Klasifikasi Pengukuran Luaran
      </h3>

      {kategori.map((item, index) => (
        <div
          key={item.level}
          className="border border-gray-200 p-4 rounded-lg shadow-sm mb-4 bg-white"
        >
          <h4 className="font-bold text-lg mb-3">{item.level}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nilai */}
            <div>
              <Label htmlFor={`nilai-${index}`} value="Nilai" />
              <TextInput
                id={`nilai-${index}`}
                type="number"
                value={item.nilai}
                onChange={(e) => onChange(index, "nilai", e.target.value)}
                required
              />
            </div>

            {/* Min - Max */}
            <div>
              <Label
                htmlFor={`range-${index}`}
                value="Range Nilai (Min - Max)"
              />
              <div className="flex gap-2">
                <TextInput
                  id={`min-${index}`}
                  type="number"
                  value={item.min}
                  onChange={(e) => onChange(index, "min", e.target.value)}
                  required
                  placeholder="Min"
                />
                <TextInput
                  id={`max-${index}`}
                  type="number"
                  value={item.max}
                  onChange={(e) => onChange(index, "max", e.target.value)}
                  required
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mt-4">
            <Label htmlFor={`deskripsi-${index}`} value="Deskripsi" />
            <Textarea
              id={`deskripsi-${index}`}
              value={item.deskripsi}
              onChange={(e) => onChange(index, "deskripsi", e.target.value)}
              required
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReusableKategoriInput;
