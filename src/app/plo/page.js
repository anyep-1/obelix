"use client";

import { useState, useEffect } from "react";
import FormInputPLO from "../components/planCom/formPLO";
import ButtonAdd from "../components/utilities/ButtonAdd";
import axios from "axios";
import Dropdown from "../components/utilities/Dropdown";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import ModalEdit from "../components/planCom/formEdit";
import ModalDelete from "../components/utilities/ModalDelete";
import ModalSuccess from "../components/utilities/ModalSuccess";

const PLO = () => {
  const [showForm, setShowForm] = useState(false);
  const [dataPLO, setDataPLO] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [kurikulumOptions, setKurikulumOptions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal delete state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  // Modal success state
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
    fetchDataPLO();
    fetchKurikulumOptions();
  }, []);

  const fetchDataPLO = async () => {
    try {
      const response = await axios.get("/api/plo");
      setDataPLO(response.data);
    } catch (error) {
      console.error("Error fetching PLO data:", error);
    }
  };

  const fetchKurikulumOptions = async () => {
    try {
      const response = await axios.get("/api/kurikulum");
      const options = response.data
        .map((item) => ({
          value: item.kurikulum_id,
          label: item.tahun_kurikulum,
        }))
        .sort((a, b) => parseInt(b.label) - parseInt(a.label));
      setKurikulumOptions(options);
      if (options.length > 0) {
        setSelectedYear(options[0].value);
      }
    } catch (error) {
      console.error("Error fetching kurikulum options:", error);
    }
  };

  // Fungsi untuk membuka modal delete dengan ID yg dipilih
  const confirmDelete = (id) => {
    setSelectedIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Fungsi hapus data setelah konfirmasi modal delete
  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/api/plo?ploId=${selectedIdToDelete}`);
      setIsDeleteModalOpen(false);
      setSuccessMessage("Data PLO berhasil dihapus.");
      setIsSuccessModalOpen(true);
      fetchDataPLO();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      setIsDeleteModalOpen(false);
    }
  };

  // Fungsi untuk menyimpan hasil edit
  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(`/api/plo?ploId=${updatedData.plo_id}`, {
        namaPLO: updatedData.nama_plo,
        nomor_plo: updatedData.nomor_plo,
      });
      setIsEditModalOpen(false);
      setEditingData(null);
      fetchDataPLO();
      setSuccessMessage("Data PLO berhasil diperbarui.");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Gagal mengedit data:", error);
    }
  };

  // Fungsi saat klik tombol edit
  const handleEdit = (plo) => {
    setEditingData(plo);
    setIsEditModalOpen(true);
  };

  // Fungsi saat data baru disimpan di FormInputPLO
  const handleDataSaved = () => {
    fetchDataPLO();
    setShowForm(false);
    setEditingData(null);
    setSuccessMessage("Data PLO berhasil ditambahkan.");
    setIsSuccessModalOpen(true);
  };

  const filteredDataPLO = dataPLO.filter(
    (item) => item.kurikulum_id === parseInt(selectedYear)
  );

  return (
    <div className="p-4">
      {userRole === "Kaprodi" && (
        <ButtonAdd onClick={() => setShowForm(true)} />
      )}

      {showForm && (
        <FormInputPLO
          onClose={() => setShowForm(false)}
          onDataSaved={handleDataSaved}
          initialData={editingData}
        />
      )}

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={editingData}
        formFields={[
          { name: "nama_plo", label: "Nama PLO" },
          { name: "nomor_plo", label: "Nomor PLO" },
        ]}
      />

      {/* Modal Delete */}
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Hapus Data PLO"
        message="Apakah Anda yakin ingin menghapus data PLO ini?"
      />

      {/* Modal Success */}
      <ModalSuccess
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />

      <div className="mb-4">
        <label htmlFor="kurikulumSelect" className="block mb-2 text-xl">
          Pilih Tahun Kurikulum:
        </label>
        <Dropdown
          options={kurikulumOptions}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Pilih tahun"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">
          PLO (Program Learning Outcome)
        </h2>
        {filteredDataPLO.length === 0 ? (
          <p>Belum ada data PLO untuk tahun ini.</p>
        ) : (
          <div>
            {filteredDataPLO.map((item, index) => (
              <div
                key={item.plo_id}
                className="flex items-center justify-between p-3 border-b border-gray-300 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{index + 1}.</span>
                  <span>{item.nama_plo}</span>
                </div>
                {userRole === "Kaprodi" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-black hover:text-gray-700 transition duration-200"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(item.plo_id)}
                      className="text-black hover:text-gray-700 transition duration-200"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PLO;
