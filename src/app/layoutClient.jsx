"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import HeaderMenu from "@/app/components/utilities/Header";
import Sidebar from "@/app/components/utilities/Sidebar";
import SplashScreen from "@/app/components/utilities/SplashScreen";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (!data.authenticated) {
          router.replace("/login");
        } else {
          const userRole = data.user.role;
          if (userRole === "Admin") {
            router.replace("/admin");
          } else {
            router.replace("/Dashboard");
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data autentikasi:", error);
        router.replace("/login");
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <SplashScreen />;
  }

  const getTitle = () => {
    switch (pathname) {
      case "/Dashboard":
        return "Selamat Datang";
      case "/profilLulusan":
        return "Profil Lulusan";
      case "/plo":
        return "Program Learning Outcome";
      case "/mataKuliah":
        return "Mata Kuliah";
      case "/clo":
        return "Course Learning Outcome";
      case "/pi":
        return "Peforma Indikator";
      case "/assesment/set":
        return "Setting Assesment Plan";
      case "/assesment/hasil":
        return "Assessment Plan";
      case "/input/dosen":
        return "Input Data Dosen dan Kelas Dosen";
      case "/input/mahasiswa":
        return "Input Data Mahasiswa dan Kelas Mahasiswa";
      case "/input/toolsAssessment":
        return "Setting Tools Assessment";
      case "/input/question":
        return "Setting Question";
      case "/input/rubrik":
        return "Setting Rubrik Penilaian";
      case "/input/portofolio":
        return "Portofolio Mata kuliah";
      case "/rubrik":
        return "Rubrik Penilaian";
      case "/skor/matakuliah":
        return "Generate Skor Mata Kuliah";
      case "/skor/pi":
        return "Generate Skor Peforma Indikator";
      case "/skor/plo":
        return "Generate Skor PLO";
      case "/portofolio":
        return "Portofolio Mata Kuliah";
      case "/monev":
        return "Monitoring Evaluasi";
      case "/report":
        return "Laporan Monitoring Evaluasi";
      case "/validasi":
        return "Validasi Evaluasi";
      case "/input/nilai":
        return "Input Nilai";
      case "/download/excel":
        return "Template Excel";
      case "/download/guide":
        return "Guidebook User";
      case "/admin":
        return "Halaman Admin";
      default:
        if (pathname.startsWith("/validasi/")) {
          return "Validasi Evaluasi";
        }
        if (pathname.startsWith("/report/")) {
          return "Laporan Monitoring Evaluasi";
        }
        if (pathname.startsWith("/rubrik/")) {
          return "Rubrik Penilaian";
        }
        if (pathname.startsWith("/portofolio/")) {
          return "Portofolio Mata Kuliah";
        }
        return "Halaman Tidak Ditemukan";
    }
  };

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (pathname === "/admin") {
    return (
      <div className="flex flex-col h-screen">
        <HeaderMenu title={getTitle()} />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64" />
      <div className="flex flex-col flex-1">
        <HeaderMenu title={getTitle()} />
        <main className="flex-1 p-4 overflow-y-auto pt-16 pl-64">
          {children}
        </main>
      </div>
    </div>
  );
}
