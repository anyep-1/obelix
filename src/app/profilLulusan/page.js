"use client";

import { useState, useEffect } from "react";
import ButtonAdd from "@/app/components/utilities/ButtonAdd";
import FormInputProfilLulusan from "@/app/components/planCom/formData";
import ModalEdit from "@/app/components/planCom/formEdit";
import ModalSuccess from "@/app/components/utilities/ModalSuccess";
import ModalDelete from "@/app/components/utilities/ModalDelete";
import axios from "axios";
import Dropdown from "../components/utilities/Dropdown";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

const ProfilLulusan = () => {
  const [editingData, setEditingData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [data, setData] = useState([]);
  const [kurikulumOptions, setKurikulumOptions] = useState([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // modal success & delete
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/profillulusan");
      setData(response.data);

      const uniqueKurikulum = [
        ...new Set(
          response.data.map((item) => item.tb_kurikulum.tahun_kurikulum)
        ),
      ]
        .map((year) => ({ value: year, label: year }))
        .sort((a, b) => b.value - a.value);

      setKurikulumOptions(uniqueKurikulum);
      if (uniqueKurikulum.length > 0) {
        setSelectedKurikulum(uniqueKurikulum[0].value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKurikulumChange = (value) => {
    setSelectedKurikulum(value);
  };

  const handleRefreshData = async () => {
    await fetchData();
    setIsEditOpen(false);
    setEditingData(null);
    setIsAdding(false);
  };

  const handleEdit = (profil) => {
    setEditingData(profil);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(`/api/profillulusan?profilId=${updatedData.profil_id}`, {
        deskripsiProfil: updatedData.deskripsi_profil,
      });
      setSuccessMessage("Berhasil mengedit data profil lulusan.");
      setIsSuccessModalOpen(true);
      await handleRefreshData();
    } catch (error) {
      console.error("Gagal mengedit data:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/profillulusan?profilId=${deleteTargetId}`);
      setIsDeleteModalOpen(false);
      setSuccessMessage("Berhasil menghapus data profil lulusan.");
      setIsSuccessModalOpen(true);
      await fetchData();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  const filteredData = data.filter(
    (item) => item.tb_kurikulum.tahun_kurikulum === selectedKurikulum
  );

  return (
    <div className="p-4">
      {userRole === "Kaprodi" && (
        <ButtonAdd onClick={() => setIsAdding(true)} />
      )}

      <div className="mt-4">
        <label htmlFor="kurikulumSelect" className="block mb-2 text-xl">
          Pilih Tahun Kurikulum:
        </label>
        <Dropdown
          options={kurikulumOptions}
          value={selectedKurikulum}
          onChange={handleKurikulumChange}
          placeholder="Pilih tahun"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Data Profil Lulusan</h2>
        {filteredData.length === 0 ? (
          <p>Belum ada data untuk tahun yang dipilih.</p>
        ) : (
          <ul className="list-disc ml-5">
            {filteredData.map((profil, index) => (
              <li key={index} className="flex flex-col space-y-2 border-b py-2">
                <div className="flex justify-between items-center">
                  {profil.deskripsi_profil}
                  {userRole === "Kaprodi" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(profil)}
                        className="text-black hover:text-gray-700 transition duration-200"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(profil.profil_id)}
                        className="text-black hover:text-gray-700 transition duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isAdding && (
        <FormInputProfilLulusan
          openModal={isAdding}
          onClose={() => setIsAdding(false)}
          onDataSaved={() => {
            setSuccessMessage("Berhasil menambahkan data profil lulusan.");
            setIsSuccessModalOpen(true);
            handleRefreshData();
          }}
        />
      )}

      {isEditOpen && editingData && (
        <ModalEdit
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveEdit}
          initialData={editingData}
          formFields={[
            {
              name: "deskripsi_profil",
              label: "Deskripsi Profil",
              fullWidth: true,
            },
          ]}
        />
      )}

      <ModalSuccess
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Data"
        description="Apakah Anda yakin ingin menghapus data ini?"
      />
    </div>
  );
};

export default ProfilLulusan;
