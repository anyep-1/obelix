"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Jika username adalah admin, otomatis set role Admin
    if (name === "username" && value === "admin") {
      setSelectedRole("Admin");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "/api/login",
        {
          username: form.username,
          password: form.password,
          role: form.username === "admin" ? "Admin" : selectedRole,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        router.replace(
          selectedRole === "Admin" || form.username === "admin"
            ? "/admin"
            : "/dashboard"
        );
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login gagal.");
    }
  };

  const isAdmin = form.username === "admin";

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="bg-blue-800 text-white py-2 px-6 flex justify-between items-center">
        <div className="flex items-center h-12 py-5">
          <Image
            src="/images/obelix.png"
            alt="OBELix Logo"
            width={120}
            height={10}
            className="object-contain ml-16"
            priority
          />
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="/login" className="hover:underline">
                Login
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="flex flex-1">
        <div className="relative w-2/3 hidden lg:block">
          <Image
            src="/images/telkom.jpg"
            alt="Telkom"
            fill
            style={{ objectFit: "cover" }}
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent via-blue-500/60 to-blue-500"></div>
        </div>

        <div className="w-full lg:w-1/3 flex items-center justify-center bg-blue-500">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
              Login
            </h2>

            {!isAdmin && !selectedRole ? (
              <div className="text-center">
                <select
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Pilih Role</option>
                  <option value="Kaprodi">Kaprodi</option>
                  <option value="DosenKoor">Dosen Koordinator</option>
                  <option value="DosenAmpu">Dosen Pengampu</option>
                  <option value="GugusKendaliMutu">Gugus Kendali Mutu</option>
                  <option value="Evaluator">Evaluator</option>
                </select>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Login
                </button>
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => setSelectedRole("")}
                    className="mt-4 text-blue-500 hover:underline block mx-auto"
                  >
                    Kembali
                  </button>
                )}
              </form>
            )}
            {message && (
              <p className="text-center text-red-500 mt-4">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
