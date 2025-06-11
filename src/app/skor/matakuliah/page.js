"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Select, Label, Table, Spinner, Alert } from "flowbite-react";

const HitungSkor = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [hasilSkor, setHasilSkor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("/api/templateRubrik/getTemplate");

        const fetchedTemplates = response.data.templates || [];

        console.log(
          "Fetched Templates:",
          JSON.stringify(fetchedTemplates, null, 2)
        );

        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleTemplateChange = async (event) => {
    const templateId = event.target.value;
    setSelectedTemplate(templateId);
    setHasilSkor(null);
    setErrorMsg("");

    if (!templateId) {
      setTemplateData(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/templateRubrik/getTemplate?id=${templateId}`
      );
      setTemplateData(response.data);
    } catch (error) {
      console.error("Error fetching template data:", error);
      setTemplateData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSkor = async () => {
    if (!selectedTemplate) return;

    setGenerating(true);
    setErrorMsg("");
    try {
      const response = await axios.post("/api/skor/mk", {
        template_id: selectedTemplate,
      });
      const data = response.data.data;
      const firstResult = Array.isArray(data) ? data[0] : data;
      setHasilSkor(firstResult || null);
    } catch (error) {
      console.error("Error generating skor:", error);
      setHasilSkor(null);
      setErrorMsg(
        error.response?.data?.message || "Terjadi kesalahan saat generate skor."
      );
    } finally {
      setGenerating(false);
    }
  };

  const safeFixed = (num) => (typeof num === "number" ? num.toFixed(2) : "-");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Generate Skor Mata Kuliah
      </h2>

      {/* Alert Error */}
      {errorMsg && (
        <Alert
          color="failure"
          onDismiss={() => setErrorMsg("")}
          className="mb-4"
        >
          <span>{errorMsg}</span>
        </Alert>
      )}

      {/* Pilihan Template */}
      <div className="mb-6">
        <Label htmlFor="template-select" className="mb-2 font-medium">
          Pilih Mata Kuliah
        </Label>
        <Select
          id="template-select"
          value={selectedTemplate}
          onChange={handleTemplateChange}
          disabled={loading}
          required
        >
          <option value="">-- Pilih Mata Kuliah --</option>
          {templates.map((template) => {
            const cloText = template?.clo?.length
              ? ` | CLO: ${template.clo.join(", ")}`
              : "";

            return (
              <option key={template.template_id} value={template.template_id}>
                {template.matkul} - {template.kurikulum}
                {cloText}
              </option>
            );
          })}
        </Select>
      </div>

      {/* Tombol Generate */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={handleGenerateSkor}
          disabled={generating || !selectedTemplate}
          color="success"
          pill
        >
          {generating && <Spinner size="sm" className="mr-2" />}
          {generating ? "Menghitung..." : "Generate Skor"}
        </Button>
      </div>

      {/* Hasil Skor */}
      {hasilSkor?.counts && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Hasil ({hasilSkor.total ?? 0} sampel)
          </h3>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Exemplary (4)</Table.HeadCell>
              <Table.HeadCell>Satisfactory (3)</Table.HeadCell>
              <Table.HeadCell>Developing (2)</Table.HeadCell>
              <Table.HeadCell>Unsatisfactory (1)</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row>
                <Table.Cell className="text-center">
                  {hasilSkor.counts.exc ?? 0}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {hasilSkor.counts.sat ?? 0}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {hasilSkor.counts.dev ?? 0}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {hasilSkor.counts.uns ?? 0}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <div className="mt-4 text-center text-sm space-y-2">
            <p>
              <span className="font-semibold">Skor:</span> (
              {hasilSkor.counts.exc ?? 0}×4 + {hasilSkor.counts.sat ?? 0}×3 +{" "}
              {hasilSkor.counts.dev ?? 0}×2 + {hasilSkor.counts.uns ?? 0}×1) /{" "}
              {hasilSkor.total ?? 0} = {safeFixed(hasilSkor.skor)}
            </p>
            <p>
              <span className="font-semibold">
                Persen jumlah mahasiswa melewati minimum requirement:
              </span>{" "}
              (({hasilSkor.counts.exc ?? 0} + {hasilSkor.counts.sat ?? 0}) /{" "}
              {hasilSkor.total ?? 0} × 100%) ={" "}
              {safeFixed(hasilSkor.persen_kelulusan)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HitungSkor;
