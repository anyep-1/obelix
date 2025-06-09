import React from "react";

const TableAssessment = ({ ploData, matkulData }) => {
  const groupedMatkul = matkulData.reduce((acc, matkul) => {
    if (!matkul.tingkat || !matkul.semester) return acc;
    if (!acc[matkul.tingkat]) acc[matkul.tingkat] = { ganjil: [], genap: [] };
    if (matkul.semester.toLowerCase() === "ganjil") {
      acc[matkul.tingkat].ganjil.push(matkul);
    } else if (matkul.semester.toLowerCase() === "genap") {
      acc[matkul.tingkat].genap.push(matkul);
    }
    return acc;
  }, {});

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
            {Object.keys(groupedMatkul).map((tingkat) => (
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
            {Object.keys(groupedMatkul).flatMap((tingkat) => [
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
          {ploData
            .map((plo, ploIndex) => {
              const cloPis = [];
              Object.keys(groupedMatkul).forEach((tingkat) => {
                groupedMatkul[tingkat].ganjil.forEach((matkul) => {
                  cloPis.push(
                    ...matkul.clo.filter(
                      (clo) => clo.plo?.id === plo.plo_id && clo.pi
                    )
                  );
                });
                groupedMatkul[tingkat].genap.forEach((matkul) => {
                  cloPis.push(
                    ...matkul.clo.filter(
                      (clo) => clo.plo?.id === plo.plo_id && clo.pi
                    )
                  );
                });
              });

              if (cloPis.length === 0) return null;

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
                      key={`${plo.plo_id}-${tingkat}-ganjil-${cloPi.pi.id}`}
                      className="border px-4 py-2"
                    >
                      {groupedMatkul[tingkat].ganjil
                        .filter((matkul) =>
                          matkul.clo.some(
                            (clo) =>
                              clo.plo?.id === plo.plo_id &&
                              clo.pi?.id === cloPi.pi.id
                          )
                        )
                        .map((matkul) => (
                          <div key={matkul.id} className="text-sm">
                            {matkul.nama}
                          </div>
                        )) || "-"}
                    </td>,
                    <td
                      key={`${plo.plo_id}-${tingkat}-genap-${cloPi.pi.id}`}
                      className="border px-4 py-2"
                    >
                      {groupedMatkul[tingkat].genap
                        .filter((matkul) =>
                          matkul.clo.some(
                            (clo) =>
                              clo.plo?.id === plo.plo_id &&
                              clo.pi?.id === cloPi.pi.id
                          )
                        )
                        .map((matkul) => (
                          <div key={matkul.id} className="text-sm">
                            {matkul.nama}
                          </div>
                        )) || "-"}
                    </td>,
                  ])}
                </tr>
              ));
            })
            .filter(Boolean)}
        </tbody>
      </table>
    </div>
  );
};

export default TableAssessment;
