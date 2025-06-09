"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StatusCard from "../components/doCom/StatusCard";
import LoadingSpinner from "../components/utilities/LoadingSpinner";
import ModalDelete from "../components/utilities/ModalDelete"; // sesuaikan path
import ModalSuccess from "../components/utilities/ModalSuccess"; // sesuaikan path

const PortofolioPage = () => {
  const [portofolioList, setPortofolioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  // Modal Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Modal Success
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, portofolioRes] = await Promise.all([
          axios.get("/api/me"),
          axios.get("/api/portofolio"),
        ]);

        setUserRole(userRes.data.user.role);
        setPortofolioList(portofolioRes.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data portofolio");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Buka modal delete dan simpan id data yang akan dihapus
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // Fungsi hapus data setelah konfirmasi modal
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/portofolio/${deleteId}`);
      setPortofolioList((prev) => prev.filter((item) => item.id !== deleteId));
      closeDeleteModal();
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Gagal menghapus portofolio:", err);
      alert("Gagal menghapus data");
      closeDeleteModal();
    }
  };

  // Tutup modal success otomatis (modal sudah handle auto close, tapi ini fallback)
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error) return <p className="text-red-500 p-6">{error}</p>;

  const blueWaveColor = "#3b82f6";
  const blueIconBg = "bg-blue-100";
  const blueIconColor = "text-blue-600";
  const blueTextColor = "text-blue-700";

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Daftar Portofolio Mata Kuliah
      </h1>

      {portofolioList.length === 0 ? (
        <p className="text-gray-500">
          Belum ada data portofolio yang tersedia.
        </p>
      ) : (
        portofolioList.map((item) => (
          <StatusCard
            key={item.id}
            id={item.id}
            title={item.tb_matkul?.nama_matkul || "Mata kuliah tidak ditemukan"}
            subtitle={`Tahun Akademik: ${item.tahun_akademik}`}
            waveColor={blueWaveColor + "33"}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            }
            iconBgColor={blueIconBg}
            iconColor={blueIconColor}
            textColor={blueTextColor}
            role={userRole}
            deleteRoles={["DosenAmpu"]}
            onDelete={() => openDeleteModal(item.id)}
            onClick={() => router.push(`/portofolio/${item.id}`)}
          />
        ))
      )}

      {/* Modal Delete */}
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Hapus Portofolio"
        message="Apakah Anda yakin ingin menghapus data portofolio ini?"
      />

      {/* Modal Success */}
      <ModalSuccess
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message="Data portofolio berhasil dihapus."
      />
    </div>
  );
};

export default PortofolioPage;
