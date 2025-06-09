"use client";

import { useState, useEffect } from "react";
import FormPI from "../components/planCom/formPI";
import ButtonAdd from "../components/utilities/ButtonAdd";
import axios from "axios";
import Dropdown from "../components/utilities/Dropdown";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import ModalEdit from "../components/planCom/formEdit";
import ModalDelete from "../components/utilities/ModalDelete";
import ModalSuccess from "../components/utilities/ModalSuccess";

const PeformaIndikator = () => {
  const [showForm, setShowForm] = useState(false);
  const [dataPI, setDataPI] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [kurikulumOptions, setKurikulumOptions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    fetchDataPI();
  }, []);

  const fetchDataPI = async () => {
    try {
      const response = await axios.get("/api/pi");
      setDataPI(response.data);

      const years = [
        ...new Set(
          response.data.map(
            (item) => item.tb_plo?.tb_kurikulum?.tahun_kurikulum
          )
        ),
      ]
        .filter(Boolean)
        .sort((a, b) => b - a)
        .map((year) => ({ value: year, label: year }));

      setKurikulumOptions(years);

      if (years.length > 0) {
        setSelectedYear(years[0].value);
      }
    } catch (error) {
      console.error("Error fetching Peforma Indikator data: ", error);
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
      await axios.delete(`/api/pi?piId=${selectedIdToDelete}`);
      setIsDeleteModalOpen(false);
      setSuccessMessage("Data Peforma Indikator berhasil dihapus.");
      setIsSuccessModalOpen(true);
      fetchDataPI();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      setIsDeleteModalOpen(false);
    }
  };

  // Fungsi untuk menyimpan hasil edit
  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(`/api/pi?piId=${updatedData.pi_id}`, {
        deskripsi_pi: updatedData.deskripsi_pi,
        nomor_pi: updatedData.nomor_pi,
      });
      setIsEditModalOpen(false);
      setEditingData(null);
      fetchDataPI();
      setSuccessMessage("Data Peforma Indikator berhasil diperbarui.");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Gagal mengedit data:", error);
    }
  };

  // Fungsi saat klik tombol edit
  const handleEdit = (pi) => {
    setEditingData(pi);
    setIsEditModalOpen(true);
  };

  // Fungsi saat data baru disimpan di FormPI
  const handleDataSaved = () => {
    fetchDataPI();
    setShowForm(false);
    setEditingData(null);
    setSuccessMessage("Data Peforma Indikator berhasil ditambahkan.");
    setIsSuccessModalOpen(true);
  };

  const filteredData = selectedYear
    ? dataPI.filter(
        (item) => item.tb_plo?.tb_kurikulum?.tahun_kurikulum === selectedYear
      )
    : dataPI;

  return (
    <div className="p-4">
      {userRole === "Kaprodi" && (
        <ButtonAdd onClick={() => setShowForm(true)} />
      )}

      {showForm && (
        <FormPI
          isVisible={showForm}
          onClose={() => setShowForm(false)}
          fetchDataPI={fetchDataPI}
          initialData={editingData}
          onDataSaved={handleDataSaved}
        />
      )}

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={editingData}
        formFields={[
          { name: "deskripsi_pi", label: "Deskripsi PI" },
          { name: "nomor_pi", label: "Nomor PI" },
        ]}
      />

      {/* Modal Delete */}
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Hapus Data Peforma Indikator"
        message="Apakah Anda yakin ingin menghapus data Peforma Indikator ini?"
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
          options={kurikulumOptions}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Pilih Tahun"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-7">Data Peforma Indikator</h2>
        {filteredData.length === 0 ? (
          <p>
            {selectedYear
              ? "Tidak ada data Peforma Indikator untuk tahun kurikulum ini."
              : "Belum ada data Peforma Indikator yang disimpan."}
          </p>
        ) : (
          <div className="bg-white divide-y divide-gray-300">
            {filteredData.map((item, index) => (
              <div
                key={item.pi_id}
                className="p-4 flex justify-between items-center border-b border-gray-300"
              >
                <div>
                  <span className="font-semibold">{index + 1}. </span>
                  {item.deskripsi_pi}
                </div>
                {userRole === "Kaprodi" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-black hover:text-gray-700 transition duration-200"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(item.pi_id)}
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

export default PeformaIndikator;
