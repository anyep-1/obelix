"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "@/app/components/utilities/LoadingSpinner";

const PortofolioDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await axios.get(`/api/portofolio/${id}`);
        setDetail(res.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil detail portofolio");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!detail) return <p>Data tidak ditemukan</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Detail Portofolio</h1>
      <p>
        <strong>Mata Kuliah:</strong> {detail.tb_matkul?.nama_matkul}
      </p>
      <p>
        <strong>Kelas:</strong> {detail.tb_kelas?.kode_kelas}
      </p>
      <p>
        <strong>Kurikulum:</strong> {detail.tb_kurikulum?.tahun_kurikulum}
      </p>
      <p>
        <strong>Tahun Akademik:</strong> {detail.tahun_akademik}
      </p>
      {detail.link_drive && (
        <p>
          <strong>Link Drive:</strong>{" "}
          <a
            href={detail.link_drive}
            className="text-blue-600 underline"
            target="_blank"
          >
            {detail.link_drive}
          </a>
        </p>
      )}
    </div>
  );
};

export default PortofolioDetail;
