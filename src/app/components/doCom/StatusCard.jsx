"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const StatusCard = ({
  id,
  title,
  subtitle,
  year,
  onClick,
  link,
  waveColor = "transparent",
  icon = null,
  iconBgColor = "bg-transparent",
  iconColor = "text-gray-400",
  role = "",
  deleteRoles = [], // <-- default kosong
  onDelete,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      router.push(link);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const canDelete = deleteRoles.includes(role);

  return (
    <div
      className="relative w-full h-32 bg-white rounded-xl shadow px-6 py-4 overflow-hidden flex items-center gap-4"
      style={{ cursor: link ? "pointer" : "default" }}
      onClick={handleClick}
      role={link ? "link" : undefined}
      tabIndex={link ? 0 : undefined}
      onKeyDown={(e) => {
        if (link && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          router.push(link);
        }
      }}
    >
      {/* Wave */}
      <div className="absolute left-0 top-0 h-full w-[24px] overflow-hidden z-0">
        <svg
          width="24"
          height="144"
          viewBox="0 0 24 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="
            M24 0 
            C16 8, 16 16, 24 24 
            C16 32, 16 40, 24 48 
            C16 56, 16 64, 24 72 
            C16 80, 16 88, 24 96 
            C16 104, 16 112, 24 120 
            C16 128, 16 136, 24 144 
            L0 144 
            L0 0 
            Z"
            fill={waveColor}
          />
        </svg>
      </div>

      {/* Icon */}
      <div
        className={`z-10 w-10 h-10 rounded-full flex items-center justify-center ${iconBgColor}`}
      >
        {icon && <div className={`${iconColor}`}>{icon}</div>}
      </div>

      {/* Text */}
      <div className="z-10 flex flex-col flex-grow justify-center">
        <span
          className="font-semibold text-lg text-gray-900 truncate"
          title={title}
        >
          {title || "–"}
        </span>
        {subtitle && (
          <p
            className="text-sm text-gray-500 mt-1 mb-0"
            style={{ lineHeight: 1.2 }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Delete */}
      {canDelete && onDelete && (
        <button
          onClick={handleDeleteClick}
          className="z-10 text-gray-400 hover:text-red-500 transition"
          aria-label="Hapus item"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

export default StatusCard;
