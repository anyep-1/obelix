"use client";

import { usePathname } from "next/navigation";
import ProfileButton from "@/app/components/utilities/ProfileButton";

const HeaderMenu = ({ title }) => {
  const pathname = usePathname();
  const isAdminPage = pathname === "/admin";

  return (
    <header
      className={`bg-blue-900 fixed top-0 p-4 z-10 shadow-md flex items-center justify-between ${
        isAdminPage ? "left-0 w-full" : "left-[250px] w-[calc(100%-250px)]"
      }`}
    >
      <h1 className="text-3xl font-bold text-white ml-[30px]">{title}</h1>

      {/* Profile Button di kanan atas */}
      <div className="mr-5">
        <ProfileButton />
      </div>
    </header>
  );
};

export default HeaderMenu;
