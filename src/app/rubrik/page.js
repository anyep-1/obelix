"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusCard from "../components/doCom/StatusCard";
import LoadingSpinner from "../components/utilities/LoadingSpinner";

const RubrikPage = () => {
  const [rubrikList, setRubrikList] = useState([]);
  const [filteredRubrik, setFilteredRubrik] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [ploFilter, setPloFilter] = useState(""); // id plo yang dipilih
  const [ploOptions, setPloOptions] = useState([]); // daftar PLO unik

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [rubrikRes, userRes] = await Promise.all([
          axios.get("/api/rubrik"),
          axios.get("/api/me"),
        ]);

        const rubriks = Array.isArray(rubrikRes.data) ? rubrikRes.data : [];
        setRubrikList(rubriks);

        // Ambil role user
        setRole(userRes.data.role || userRes.data.user?.role || "");

        // Ambil semua PLO unik dari data rubrik
        const allPlos = rubriks
          .map((r) => r.tb_plo)
          .filter((plo) => plo !== null && plo !== undefined);

        // Jika tb_plo adalah array, flatten dulu (sesuaikan kalau data beda)
        // Kalau tb_plo satu objek, sesuaikan di sini:
        const uniquePlos = Array.from(
          new Map(allPlos.map((plo) => [plo.plo_id, plo])).values()
        );

        setPloOptions(uniquePlos);
        setFilteredRubrik(rubriks);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter saat ploFilter berubah
  useEffect(() => {
    if (!ploFilter) {
      setFilteredRubrik(rubrikList);
    } else {
      const filterId = parseInt(ploFilter, 10);

      setFilteredRubrik(
        rubrikList.filter((r) => r.tb_plo && r.tb_plo.plo_id === filterId)
      );
    }
  }, [ploFilter, rubrikList]);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus rubrik ini?")) return;

    try {
      await axios.delete(`/api/rubrik/${id}`);
      setRubrikList((prev) => prev.filter((r) => r.template_id !== id));
    } catch (err) {
      console.error("Gagal menghapus", err);
    }
  };

  const renderIcon = (sudah, iconColor) => {
    if (sudah) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${iconColor}`}
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm113 161c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${iconColor}`}
          fill="currentColor"
          viewBox="0 0 15 15"
        >
          <path
            fill="currentColor"
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        List Rubrik Pengukuran
      </h2>

      {/* Dropdown filter PLO */}
      <div className="mb-6">
        <label
          htmlFor="plo-filter"
          className="block mb-1 font-medium text-gray-700"
        >
          Filter berdasarkan PLO
        </label>
        <select
          id="plo-filter"
          className="border rounded px-3 py-2"
          value={ploFilter}
          onChange={(e) => setPloFilter(e.target.value)}
        >
          <option value="">Semua PLO</option>
          {[...ploOptions]
            .sort((a, b) => parseInt(a.nomor_plo) - parseInt(b.nomor_plo))
            .map((plo) => (
              <option key={plo.plo_id} value={plo.plo_id}>
                PLO {plo.nomor_plo}
              </option>
            ))}
        </select>
      </div>

      {filteredRubrik.length > 0 ? (
        filteredRubrik.map((rubrik) => {
          const sudah = rubrik.sudahGenerate;

          const waveColor = sudah ? "#04e4003a" : "#ff000038";
          const bgIcon = sudah ? "bg-green-100" : "bg-red-100";
          const iconColor = sudah ? "text-green-600" : "text-red-600";
          const textColor = sudah ? "text-green-700" : "text-red-700";
          const subtitle = sudah ? "Sudah digenerate" : "Belum digenerate";

          return (
            <StatusCard
              key={rubrik.template_id}
              id={rubrik.template_id}
              title={rubrik.tb_matkul?.nama_matkul || "–"}
              subtitle={subtitle}
              link={`/rubrik/${rubrik.template_id}`}
              waveColor={waveColor}
              icon={renderIcon(sudah, iconColor)}
              iconBgColor={bgIcon}
              iconColor={iconColor}
              textColor={textColor}
              role={role}
              deleteRoles={["DosenKoor"]}
              onDelete={handleDelete}
            />
          );
        })
      ) : (
        <p className="text-gray-500">Tidak ada data rubrik.</p>
      )}
    </div>
  );
};

export default RubrikPage;
