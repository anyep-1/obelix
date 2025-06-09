"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "../components/utilities/LoadingSpinner";
import StatusCard from "../components/doCom/StatusCard";

const ValidasiEvaluasi = () => {
  const [matkulList, setMatkulList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [_, matkulRes] = await Promise.all([
          axios.get("/api/me"),
          axios.get("/api/monev/matkul-with-data"),
        ]);

        setMatkulList(matkulRes.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  const filteredList = matkulList.filter((item) =>
    item.rtList?.some((rt) => rt.statusImplementasi === "Sudah")
  );

  if (filteredList.length === 0) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Validasi Evaluasi Mata Kuliah
        </h1>
        <p>Belum ada data monitoring dan evaluasi dengan status "Sudah".</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Validasi Evaluasi Mata Kuliah
      </h1>
      <div className="flex flex-col space-y-6">
        {filteredList.map((item) => (
          <div
            key={item.matkul.matkul_id}
            onClick={() => router.push(`/validasi/${item.matkul.matkul_id}`)}
            className="cursor-pointer"
          >
            <StatusCard
              className="w-full"
              id={item.id}
              title={item.matkul.nama_matkul}
              subtitle="Lihat Detail"
              waveColor="#3b82f63a" // biru transparan
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              textColor="text-blue-700"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidasiEvaluasi;
