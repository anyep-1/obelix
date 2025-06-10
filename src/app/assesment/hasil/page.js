"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TableAssessment from "@/app/components/planCom/TableAssessment";
import Alert from "@/app/components/utilities/Alert";
import LoadingSpinner from "@/app/components/utilities/LoadingSpinner";

const AssessmentPlan = () => {
  const [ploData, setPloData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/assesment/hasil");
        const { data = [] } = response.data;
        setPloData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assessment plan data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">
        Hasil Assessment Plan
      </h2>

      {ploData.length === 0 ? (
        <Alert.InfoAlert
          title="Belum ada mata kuliah yang diset."
          message="Silakan atur mata kuliah terlebih dahulu untuk melihat hasil assessment."
        />
      ) : (
        <TableAssessment ploData={ploData} />
      )}
    </div>
  );
};

export default AssessmentPlan;
