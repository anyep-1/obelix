import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  HomeIcon,
  CheckIcon,
  ClipboardListIcon,
  LightBulbIcon,
  CogIcon,
} from "@heroicons/react/outline";

const Sidebar = () => {
  const [planOpen, setPlanOpen] = useState(false);
  const [doOpen, setDoOpen] = useState(false);
  const [rubrikOpen, setRubrikOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [actOpen, setActOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [assesmentPlanOpen, setAssesmentPlanOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const togglePlan = () => setPlanOpen(!planOpen);
  const toggleDo = () => setDoOpen(!doOpen);
  const toggleRubrik = () => setRubrikOpen(!rubrikOpen);
  const toggleCheck = () => setCheckOpen(!checkOpen);
  const toggleAct = () => setActOpen(!actOpen);
  const toggleAssesmentPlan = () => setAssesmentPlanOpen(!assesmentPlanOpen);
  const toggleSetting = () => setSettingOpen(!settingOpen);
  const toggleService = () => setServiceOpen(!serviceOpen);

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
  });

  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r shadow-md overflow-auto"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto flex flex-col space-y-2">
        <ul className="space-y-2 font-medium">
          {/* Link ke Dashboard */}
          <li>
            <Link href="/Dashboard" legacyBehavior>
              <a className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 transition duration-150">
                <HomeIcon className="w-6 h-6 text-gray-500" />
                <span className="ms-3">Dashboard</span>
              </a>
            </Link>
          </li>

          {/* Submenu Plan */}
          <li>
            <button
              type="button"
              className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              onClick={togglePlan}
            >
              <ClipboardListIcon className="w-6 h-6 text-gray-500" />
              <span className="flex-1 ms-3 text-left">Plan</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  planOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`py-2 transition-all duration-300 ease-in-out overflow-hidden ${
                planOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <li>
                <Link href="/profilLulusan" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    Profil Lulusan
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/plo" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    PLO
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pi" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    Peforma Indikator
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/mataKuliah" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    Mata Kuliah
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/clo" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    CLO
                  </a>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100"
                  onClick={toggleAssesmentPlan}
                >
                  <span className="flex-1 text-left">Assessment Plan</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      assesmentPlanOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <ul
                  className={`py-2 transition-all duration-400 ease-in-out overflow-auto ${
                    assesmentPlanOpen
                      ? "max-h-100 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {userRole === "Kaprodi" && (
                    <li>
                      <Link href="/assesment/set" legacyBehavior>
                        <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-14 hover:bg-gray-100">
                          Set Assessment Plan
                        </a>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/assesment/hasil" legacyBehavior>
                      <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-14 hover:bg-gray-100">
                        Hasil Assessment Plan
                      </a>
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                {(userRole === "Kaprodi" ||
                  userRole === "DosenAmpu" ||
                  userRole === "DosenKoor") && (
                  <>
                    <button
                      type="button"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100"
                      onClick={toggleSetting}
                    >
                      <span className="flex-1 text-left">Setting Data</span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${
                          settingOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <ul
                      className={`py-2 transition-all duration-400 ease-in-out overflow-auto ${
                        settingOpen
                          ? "max-h-100 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {userRole === "Kaprodi" && (
                        <li>
                          <Link href="/input/dosen" legacyBehavior>
                            <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-14 hover:bg-gray-100">
                              Set Dosen dan Kelas Dosen
                            </a>
                          </Link>
                        </li>
                      )}
                      {(userRole === "DosenAmpu" ||
                        userRole === "DosenKoor") && (
                        <li>
                          <Link href="/input/mahasiswa" legacyBehavior>
                            <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-14 hover:bg-gray-100">
                              Set Mahasiswa dan Kelas Mahasiswa
                            </a>
                          </Link>
                        </li>
                      )}
                      {userRole === "Kaprodi" && (
                        <li>
                          <Link href="/input/toolsAssessment" legacyBehavior>
                            <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-14 hover:bg-gray-100">
                              Set Assessment Tool
                            </a>
                          </Link>
                        </li>
                      )}
                      {userRole === "DosenKoor" && (
                        <li>
                          <Link href="/input/question" legacyBehavior>
                            <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-14 hover:bg-gray-100">
                              Set Question
                            </a>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </li>
            </ul>
          </li>

          {/* Submenu Do */}
          <li>
            <button
              type="button"
              className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              onClick={toggleDo}
            >
              <LightBulbIcon className="w-6 h-6 text-gray-500" />
              <span className="flex-1 ms-3 text-left">Do</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  doOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`py-2 transition-all duration-300 ease-in-out overflow-hidden ${
                doOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Submenu Rubrik Penilaian */}
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100"
                  onClick={toggleRubrik}
                >
                  <span className="flex-1 text-left">Rubrik Pengukuran</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      rubrikOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <ul
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    rubrikOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {userRole === "DosenKoor" && (
                    <>
                      <li>
                        <Link href="/input/rubrik" legacyBehavior>
                          <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-16 hover:bg-gray-100">
                            Input Form Rubrik
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/skor/matakuliah" legacyBehavior>
                          <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-16 hover:bg-gray-100">
                            Hitung Skor Mata kuliah
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/skor/pi" legacyBehavior>
                          <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-16 hover:bg-gray-100">
                            Hitung Skor PI dan PLO
                          </a>
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link href="/rubrik" legacyBehavior>
                      <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-16 hover:bg-gray-100">
                        Rubrik
                      </a>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Menu lainnya */}
              {userRole === "DosenAmpu" && (
                <>
                  <li>
                    <Link href="/input/nilai" legacyBehavior>
                      <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                        Input Nilai
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/input/portofolio" legacyBehavior>
                      <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                        Input Portofolio
                      </a>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/portofolio" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    Portofolio Mata Kuliah
                  </a>
                </Link>
              </li>
            </ul>
          </li>

          {/* Submenu Check */}
          <li>
            <button
              type="button"
              className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              onClick={toggleCheck}
            >
              <CheckIcon className="w-6 h-6 text-gray-500" />
              <span className="flex-1 ms-3 text-left">Check</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  checkOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`py-2 transition-all duration-300 ease-in-out overflow-hidden ${
                checkOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {userRole === "GugusKendaliMutu" && (
                <li>
                  <Link href="/monev" legacyBehavior>
                    <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                      Monitoring Evaluasi
                    </a>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/report" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    Laporan
                  </a>
                </Link>
              </li>
            </ul>
          </li>

          {/* Submenu Act */}
          <li>
            <button
              type="button"
              className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
              onClick={toggleAct}
            >
              <LightBulbIcon className="w-6 h-6 text-gray-500" />
              <span className="flex-1 ms-3 text-left">Act</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  actOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`py-2 transition-all duration-300 ease-in-out overflow-hidden ${
                actOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <li>
                <Link href="/validasi" legacyBehavior>
                  <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                    Hasil Validasi Evaluasi
                  </a>
                </Link>
              </li>
            </ul>
          </li>
          {(userRole === "DosenKoor" ||
            userRole === "DosenAmpu" ||
            userRole === "Kaprodi" ||
            userRole === "GugusKendaliMutu") && (
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
                onClick={toggleService}
              >
                <CogIcon className="w-6 h-6 text-gray-500" />
                <span className="flex-1 ms-3 text-left">Services</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    serviceOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <ul
                className={`py-2 transition-all duration-300 ease-in-out overflow-hidden ${
                  serviceOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <li>
                  <Link href="/download/excel" legacyBehavior>
                    <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                      Download Template Excel
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/download/guide" legacyBehavior>
                    <a className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100">
                      Download Panduan
                    </a>
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
