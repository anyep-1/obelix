"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import ButtonAdd from "@/app/components/utilities/ButtonAdd";

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Kaprodi", label: "Kaprodi" },
  { value: "DosenKoor", label: "Dosen Koordinator" },
  { value: "DosenAmpu", label: "Dosen Pengampu" },
  { value: "GugusKendaliMutu", label: "Gugus Kendali Mutu" },
  { value: "Evaluator", label: "Evaluator" },
];

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user_id: null,
    nama: "",
    username: "",
    password: "",
    role: "Admin",
  });

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Gagal mengambil data pengguna.");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        const res = await axios.patch("/api/users", form);
        setMessage(res.data.message);
        setUsers(
          users.map((user) =>
            user.user_id === form.user_id ? res.data.user : user
          )
        );
      } else {
        const res = await axios.post("/api/users", form);
        setMessage(res.data.message);
        setUsers([...users, res.data.user]);
      }

      setForm({ user_id: null, username: "", password: "", role: "Admin" });
      setIsOpen(false);
      setIsEdit(false);
    } catch (error) {
      console.error("Error saving user:", error);
      setMessage("Gagal menyimpan data pengguna.");
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsOpen(true);
    setIsEdit(true);
  };

  const handleDelete = async (user_id) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await axios.delete("/api/users", { data: { user_id } });
      setUsers(users.filter((user) => user.user_id !== user_id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Gagal menghapus pengguna.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6">Admin - Manajemen User</h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.user_id} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border flex justify-center space-x-2">
                  <button onClick={() => handleEdit(user)}>
                    <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDelete(user.user_id)}>
                    <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ButtonAdd onClick={() => setIsOpen(true)} />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-xl font-bold">
              {isEdit ? "Edit User" : "Tambah User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nama"
                placeholder="Nama Lengkap"
                value={form.nama}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required={!isEdit}
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEdit ? "Simpan Perubahan" : "Tambah User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
