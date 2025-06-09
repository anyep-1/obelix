"use client";

import { useState, useEffect } from "react";
import ModalEdit from "../components/planCom/formEdit";
import ButtonAdd from "../components/utilities/ButtonAdd";
import Dropdown from "../components/utilities/Dropdown";
import FormInputMatkul from "../components/planCom/formMatkul";
import TableMatkul from "../components/planCom/TableMatkul";
import ModalDelete from "../components/utilities/ModalDelete";
import ModalSuccess from "../components/utilities/ModalSuccess";
import axios from "axios";

const MataKuliah = () => {
  const [showForm, setShowForm] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [dataMatkul, setDataMatkul] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editingData, setEditingData] = useState(null);

  // Modal Delete state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  // Modal Success state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.authenticated) {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    fetchUserRole();
    fetchDataMatkul();
  }, []);

  const fetchDataMatkul = async () => {
    try {
      const response = await axios.get("/api/matkul");
      setDataMatkul(response.data);

      const years = [
        ...new Set(
          response.data.map((item) => item.tb_kurikulum.tahun_kurikulum)
        ),
      ].map((year) => ({ value: year, label: year }));
      setAvailableYears(years);
    } catch (error) {
      console.error("Error fetching mata kuliah data:", error);
    }
  };

  // Fungsi untuk membuka modal delete
  const confirmDelete = (id) => {
    setSelectedIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk eksekusi delete setelah konfirmasi modal
  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/api/matkul?matkulId=${selectedIdToDelete}`);
      setIsDeleteModalOpen(false);
      setSuccessMessage("Data mata kuliah berhasil dihapus.");
      setIsSuccessModalOpen(true);
      fetchDataMatkul();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      setIsDeleteModalOpen(false);
    }
  };

  // Ubah handleDelete jadi hanya buka modal confirm, bukan langsung delete
  const handleDelete = (id) => {
    confirmDelete(id);
  };

  const handleEdit = (matkul) => {
    setEditingData(matkul);
    setShowModalEdit(true);
  };

  const handleSaveEdit = async (updatedData) => {
    if (!editingData?.matkul_id) {
      console.error("ID matkul tidak valid!");
      return;
    }
    try {
      await axios.put(`/api/matkul?id=${editingData.matkul_id}`, {
        namaMatkul: updatedData.nama_matkul,
        kodeMatkul: updatedData.kode_matkul,
        jumlahSKS: updatedData.jumlah_sks,
        tingkat: updatedData.tingkat,
        semester: updatedData.semester,
      });

      setShowModalEdit(false);
      setEditingData(null);
      fetchDataMatkul();
      setSuccessMessage("Data mata kuliah berhasil diperbarui.");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const handleCloseEdit = () => {
    setShowModalEdit(false);
    setEditingData(null);
  };

  // Tambahkan callback saat data baru disimpan di form input
  const handleDataSaved = () => {
    fetchDataMatkul();
    setShowForm(false);
    setSuccessMessage("Data mata kuliah berhasil ditambahkan.");
    setIsSuccessModalOpen(true);
  };

  const filteredData = selectedYear
    ? dataMatkul.filter(
        (item) => item.tb_kurikulum.tahun_kurikulum === selectedYear
      )
    : dataMatkul;

  return (
    <div className="p-4">
      <div className="relative z-10 mb-4">
        {userRole === "Kaprodi" && (
          <ButtonAdd onClick={() => setShowForm(true)} className="relative" />
        )}
      </div>

      {showForm && (
        <FormInputMatkul
          openModal={showForm}
          onClose={() => setShowForm(false)}
          fetchDataMatkul={fetchDataMatkul}
          onDataSaved={handleDataSaved}
        />
      )}

      {showModalEdit && (
        <ModalEdit
          isOpen={showModalEdit}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
          initialData={editingData}
          formFields={[
            { name: "nama_matkul", label: "Nama Mata Kuliah" },
            { name: "jumlah_sks", label: "SKS", type: "number" },
            { name: "kode_matkul", label: "Kode Mata Kuliah" },
            {
              name: "tingkat",
              label: "Tingkat",
              type: "select",
              options: [1, 2, 3, 4].map((opt) => ({
                value: `Tingkat ${opt}`,
                label: `Tingkat ${opt}`,
              })),
            },
            {
              name: "semester",
              label: "Semester",
              type: "select",
              options: ["Ganjil", "Genap"].map((opt) => ({
                value: opt,
                label: opt,
              })),
            },
          ]}
        />
      )}

      {/* Modal Delete */}
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Hapus Data Mata Kuliah"
        message="Apakah Anda yakin ingin menghapus data mata kuliah ini?"
      />

      {/* Modal Success */}
      <ModalSuccess
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />

      <div className="mt-4">
        <label htmlFor="tahun" className="block mb-2 text-xl">
          Pilih Tahun Kurikulum:
        </label>
        <Dropdown
          options={availableYears}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Semua Tahun"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-7 text-gray-800">
          Data Mata Kuliah
        </h2>

        {filteredData.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            Belum ada data mata kuliah yang tersedia.
          </p>
        ) : (
          <TableMatkul
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isEditable={userRole === "Kaprodi"}
          />
        )}
      </div>
    </div>
  );
};

export default MataKuliah;
