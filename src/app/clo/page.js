"use client";

import { useState, useEffect } from "react";
import FormCLO from "../components/planCom/formCLO";
import ModalEdit from "../components/planCom/formEdit";
import ButtonAdd from "../components/utilities/ButtonAdd";
import axios from "axios";
import Dropdown from "../components/utilities/Dropdown";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import ModalDelete from "../components/utilities/ModalDelete";
import ModalSuccess from "../components/utilities/ModalSuccess";

const CLO = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataCLO, setDataCLO] = useState([]);
  const [selectedMatkul, setSelectedMatkul] = useState("");
  const [matkulOptions, setMatkulOptions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState({
    open: false,
    message: "",
  });
  const [deleteId, setDeleteId] = useState(null);

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
    fetchDataCLO();
  }, []);

  const fetchDataCLO = async () => {
    try {
      const response = await axios.get("/api/clo");
      setDataCLO(response.data);

      const matkulResponse = await axios.get("/api/matkul");
      const matkulData = matkulResponse.data.map((item) => ({
        value: item.matkul_id,
        label: item.nama_matkul,
      }));
      setMatkulOptions(matkulData);

      const firstMatkulWithCLO = response.data.find((item) => item.matkul_id);
      if (firstMatkulWithCLO) {
        setSelectedMatkul(firstMatkulWithCLO.matkul_id);
      }
    } catch (error) {
      console.error("Error fetching CLO data: ", error);
    }
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleEdit = (clo) => {
    setEditingData(clo);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await axios.put(`/api/clo?cloId=${updatedData.clo_id}`, updatedData);
      fetchDataCLO();
      setModalSuccess({ open: true, message: "Berhasil memperbarui CLO." });
      closeEditModal();
    } catch (error) {
      console.error("Gagal memperbarui CLO:", error);
    }
  };

  const confirmDelete = (cloId) => {
    setDeleteId(cloId);
    setModalDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/clo?cloId=${deleteId}`);
      fetchDataCLO();
      setModalSuccess({ open: true, message: "Berhasil menghapus CLO." });
    } catch (error) {
      console.error("Gagal menghapus CLO:", error);
    } finally {
      setModalDeleteOpen(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingData(null);
  };

  const filteredData = selectedMatkul
    ? dataCLO.filter((item) => item.matkul_id === selectedMatkul)
    : [];

  return (
    <div className="p-4">
      {userRole === "DosenKoor" && <ButtonAdd onClick={handleButtonClick} />}

      {showForm && (
        <FormCLO
          isVisible={showForm}
          onClose={() => setShowForm(false)}
          fetchDataCLO={fetchDataCLO}
          onSuccess={() =>
            setModalSuccess({
              open: true,
              message: "Berhasil menambahkan CLO.",
            })
          }
        />
      )}

      <ModalEdit
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSave={(updatedData) =>
          handleSaveEdit({
            clo_id: editingData.clo_id,
            nama_clo: updatedData.nama_clo,
            nomor_clo: updatedData.nomor_clo,
          })
        }
        initialData={editingData}
        formFields={[
          { name: "nama_clo", label: "Nama CLO" },
          { name: "nomor_clo", label: "Nomor CLO" },
        ]}
      />

      <ModalDelete
        isOpen={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <ModalSuccess
        isOpen={modalSuccess.open}
        onClose={() => setModalSuccess({ open: false, message: "" })}
        message={modalSuccess.message}
      />

      <div className="mt-4">
        <label htmlFor="matkul" className="block mb-2 text-xl">
          Pilih Mata Kuliah:
        </label>
        <Dropdown
          options={matkulOptions}
          value={selectedMatkul}
          onChange={setSelectedMatkul}
          placeholder="Pilih Mata Kuliah"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Data CLO</h2>
        {filteredData.length === 0 ? (
          <p>
            {selectedMatkul
              ? "Tidak ada data CLO untuk mata kuliah ini."
              : "Belum ada data CLO yang disimpan."}
          </p>
        ) : (
          <div>
            {filteredData.map((item, index) => (
              <div
                key={item.clo_id}
                className="flex items-center justify-between p-3 border-b border-gray-300 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{index + 1}.</span>
                  <span>{item.nama_clo}</span>
                </div>

                {userRole === "DosenKoor" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-black hover:text-gray-700 transition duration-200"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(item.clo_id)}
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

export default CLO;
