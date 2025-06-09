"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StatusCard from "../components/doCom/StatusCard";
import LoadingSpinner from "../components/utilities/LoadingSpinner";
import ModalDelete from "../components/utilities/ModalDelete";
import ModalSuccess from "../components/utilities/ModalSuccess";

const Report = () => {
  const [matkulList, setMatkulList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [meRes, matkulRes] = await Promise.all([
          axios.get("/api/me"),
          axios.get("/api/monev/matkul-with-data"),
        ]);
        setCurrentUser(meRes.data.user);
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

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) {
      console.log("deleteId kosong");
      return;
    }
    try {
      await axios.delete(`/api/monev?id=${deleteId}`);
      // Update list dengan filter berdasarkan monev_id
      setMatkulList((prev) =>
        prev.filter((item) => item.monev_id !== deleteId)
      );
      setIsDeleteModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Gagal menghapus data monev:", err);
      alert("Gagal menghapus data");
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  if (matkulList.length === 0) {
    return (
      <div className="p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Daftar Mata Kuliah dengan Monitoring & Evaluasi
        </h2>
        <p className="text-gray-500">Belum ada data monitoring dan evaluasi.</p>
      </div>
    );
  }

  // Urutkan sehingga yang userTujuan sama dengan currentUser tampil paling atas
  const sortedMatkulList = [...matkulList].sort((a, b) => {
    const aIsTujuan = a.userTujuan?.user_id === currentUser?.user_id ? 0 : 1;
    const bIsTujuan = b.userTujuan?.user_id === currentUser?.user_id ? 0 : 1;
    return aIsTujuan - bIsTujuan;
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Daftar Mata Kuliah dengan Monitoring & Evaluasi
      </h2>

      <div className="flex flex-col space-y-6">
        {sortedMatkulList.map((item) => {
          const isUserTujuan =
            currentUser?.user_id === item.userTujuan?.user_id;

          const waveColor = isUserTujuan ? "#22c55e3a" : "#3b82f63a";
          const iconBgColor = isUserTujuan ? "bg-green-100" : "bg-blue-100";
          const iconColor = isUserTujuan ? "text-green-600" : "text-blue-600";
          const textColor = isUserTujuan ? "text-green-700" : "text-blue-700";

          return (
            <StatusCard
              key={item.monev_id}
              id={item.monev_id}
              title={item.matkul.nama_matkul}
              subtitle={`Tujuan: ${item.userTujuan?.nama || "–"}`}
              waveColor={waveColor}
              iconBgColor={iconBgColor}
              iconColor={iconColor}
              textColor={textColor}
              icon={
                isUserTujuan ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 ${iconColor}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : null
              }
              role={currentUser?.role || ""}
              deleteRoles={["GugusKendaliMutu"]}
              onClick={() => router.push(`/report/${item.matkul.matkul_id}`)}
              onDelete={() => handleDelete(item.monev_id)}
            />
          );
        })}
      </div>

      {/* Modal Konfirmasi Hapus */}
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Monev"
        message="Apakah Anda yakin ingin menghapus data Monev ini?"
      />

      {/* Modal Sukses */}
      <ModalSuccess
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Data Monev berhasil dihapus."
      />
    </div>
  );
};

export default Report;
