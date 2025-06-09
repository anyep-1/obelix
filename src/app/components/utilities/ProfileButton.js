"use client";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const ProfileButton = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      {user ? (
        <>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition duration-200"
          >
            <FaUserCircle className="text-2xl" />
            {user.username}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-4 transition-transform transform scale-95 origin-top-right animate-fadeIn">
              <div className="flex items-center gap-3 mb-3">
                <FaUserCircle className="text-3xl text-gray-500" />
                <div>
                  <p className="text-gray-800 font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
};

export default ProfileButton;
