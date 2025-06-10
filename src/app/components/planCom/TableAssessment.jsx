import React from "react";

const TableAssessment = ({ ploData, filteredPloData }) => {
  const getGroupedMatkul = (matkulList) => {
    return matkulList.reduce((acc, matkul) => {
      if (!matkul.tingkat || !matkul.semester) return acc;
      if (!acc[matkul.tingkat]) acc[matkul.tingkat] = { ganjil: [], genap: [] };
      const semester = matkul.semester.toLowerCase();
      if (semester === "ganjil") {
        acc[matkul.tingkat].ganjil.push(matkul);
      } else if (semester === "genap") {
        acc[matkul.tingkat].genap.push(matkul);
      }
      return acc;
    }, {});
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th rowSpan={2} className="border px-4 py-2 text-left">
              No PLO
            </th>
            <th rowSpan={2} className="border px-4 py-2 text-left">
              Deskripsi PLO
            </th>
            <th rowSpan={2} className="border px-4 py-2 text-left">
              No PI
            </th>
            <th rowSpan={2} className="border px-4 py-2 text-left">
              Deskripsi PI
            </th>
            {[
              ...new Set(
                ploData.flatMap((plo) =>
                  plo.matkul.map((m) => m.tingkat).filter(Boolean)
                )
              ),
            ].map((tingkat) => (
              <th
                key={tingkat}
                colSpan={2}
                className="border px-4 py-2 text-center"
              >
                {tingkat}
              </th>
            ))}
          </tr>
          <tr className="bg-gray-100 text-sm">
            {[
              ...new Set(
                ploData.flatMap((plo) =>
                  plo.matkul.map((m) => m.tingkat).filter(Boolean)
                )
              ),
            ].flatMap((tingkat) => [
              <th key={`${tingkat}-ganjil`} className="border px-4 py-2">
                Ganjil
              </th>,
              <th key={`${tingkat}-genap`} className="border px-4 py-2">
                Genap
              </th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {ploData.map((plo, idxPlo) => {
            const groupedMatkul = getGroupedMatkul(plo.matkul);

            const cloPis = [];
            Object.values(groupedMatkul).forEach((semesterGroup) => {
              ["ganjil", "genap"].forEach((sem) => {
                semesterGroup[sem].forEach((matkul) => {
                  if (!Array.isArray(matkul.clo)) {
                    console.warn(
                      `🚨 [${idxPlo}] matkul.clo bukan array:`,
                      matkul
                    );
                    return;
                  }
                  const filtered = matkul.clo.filter(
                    (clo) => clo.pi && clo.pi?.plo_id === plo.plo_id
                  );
                  if (filtered.length > 0) {
                    console.log(
                      `✅ [${idxPlo}] Ditemukan CLO terkait PLO:`,
                      filtered
                    );
                  }
                  cloPis.push(...filtered);
                });
              });
            });

            if (cloPis.length === 0) {
              console.warn(
                `⚠️ [${idxPlo}] Tidak ada CLO yang cocok dengan PLO ${plo.plo_id}`
              );
              return null;
            }

            return cloPis.map((cloPi, index) => (
              <tr
                key={`${plo.plo_id}-${cloPi.pi.id}-${index}`}
                className="hover:bg-gray-50"
              >
                {index === 0 && (
                  <>
                    <td
                      rowSpan={cloPis.length}
                      className="border px-4 py-2 text-center bg-gray-50"
                    >
                      {plo.nomor_plo}
                    </td>
                    <td
                      rowSpan={cloPis.length}
                      className="border px-4 py-2 bg-gray-50"
                    >
                      {plo.nama_plo}
                    </td>
                  </>
                )}
                <td className="border px-4 py-2 text-center">
                  {cloPi.pi.nomor}
                </td>
                <td className="border px-4 py-2">{cloPi.pi.deskripsi}</td>

                {Object.keys(groupedMatkul).flatMap((tingkat) => [
                  <td
                    key={`${tingkat}-ganjil-${cloPi.pi.id}`}
                    className="border px-4 py-2"
                  >
                    {groupedMatkul[tingkat].ganjil
                      .filter((matkul) =>
                        matkul.clo
                          .filter((clo) => clo.plo?.id === plo.plo_id)
                          .some((clo) => clo.pi?.id === cloPi.pi.id)
                      )
                      .map((matkul) => (
                        <div key={matkul.id} className="text-sm">
                          {matkul.nama}
                        </div>
                      ))}
                  </td>,
                  <td
                    key={`${tingkat}-genap-${cloPi.pi.id}`}
                    className="border px-4 py-2"
                  >
                    {groupedMatkul[tingkat].genap
                      .filter((matkul) =>
                        matkul.clo
                          .filter((clo) => clo.plo?.id === plo.plo_id)
                          .some((clo) => clo.pi?.id === cloPi.pi.id)
                      )
                      .map((matkul) => (
                        <div key={matkul.id} className="text-sm">
                          {matkul.nama}
                        </div>
                      ))}
                  </td>,
                ])}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableAssessment;
