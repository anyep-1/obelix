import React from "react";

const TableAssessment = ({ ploData }) => {
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

  const allTingkat = [
    ...new Set(
      ploData.flatMap((plo) => plo.matkul.map((m) => m.tingkat).filter(Boolean))
    ),
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
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
            {allTingkat.map((tingkat) => (
              <th
                key={tingkat}
                colSpan={2}
                className="border px-4 py-2 text-center"
              >
                {tingkat}
              </th>
            ))}
          </tr>
          <tr className="bg-gray-100">
            {allTingkat.flatMap((tingkat) => [
              <th
                key={`${tingkat}-ganjil`}
                className="border px-4 py-2 text-center"
              >
                Ganjil
              </th>,
              <th
                key={`${tingkat}-genap`}
                className="border px-4 py-2 text-center"
              >
                Genap
              </th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {[...ploData]
            .sort((a, b) => Number(a.nomor_plo) - Number(b.nomor_plo))
            .map((plo) => {
              const groupedMatkul = getGroupedMatkul(plo.matkul);

              const cloPis = [];
              Object.values(groupedMatkul).forEach((semesterGroup) => {
                ["ganjil", "genap"].forEach((sem) => {
                  semesterGroup[sem].forEach((matkul) => {
                    if (!Array.isArray(matkul.clo)) return;
                    const filtered = matkul.clo.filter(
                      (clo) => clo.pi && clo.pi.plo_id === plo.plo_id
                    );
                    cloPis.push(...filtered);
                  });
                });
              });

              const piMap = new Map();
              cloPis.forEach((clo) => {
                const piId = clo.pi.id;
                if (!piMap.has(piId)) {
                  piMap.set(piId, {
                    pi: clo.pi,
                    clos: [clo],
                  });
                } else {
                  piMap.get(piId).clos.push(clo);
                }
              });

              const piList = Array.from(piMap.values()).sort(
                (a, b) => Number(a.pi.nomor_pi) - Number(b.pi.nomor_pi)
              );

              if (piList.length === 0) return null;

              return piList.map((piGroup, indexPi) => (
                <tr
                  key={`${plo.plo_id}-${piGroup.pi.id}-${indexPi}`}
                  className="hover:bg-gray-50"
                >
                  {indexPi === 0 && (
                    <>
                      <td
                        rowSpan={piList.length}
                        className="border px-4 py-2 text-center bg-gray-50 font-semibold"
                      >
                        {plo.nomor_plo}
                      </td>
                      <td
                        rowSpan={piList.length}
                        className="border px-4 py-2 bg-gray-50"
                      >
                        {plo.nama_plo}
                      </td>
                    </>
                  )}
                  <td className="border px-4 py-2 text-center">
                    {piGroup.pi.nomor}
                  </td>
                  <td className="border px-4 py-2">{piGroup.pi.deskripsi}</td>
                  {allTingkat.flatMap((tingkat) => {
                    const ganjilMatkul = groupedMatkul[tingkat]?.ganjil || [];
                    const genapMatkul = groupedMatkul[tingkat]?.genap || [];

                    const renderMatkul = (list) =>
                      list
                        .filter((matkul) =>
                          matkul.clo?.some(
                            (clo) =>
                              clo.plo?.id === plo.plo_id &&
                              clo.pi?.id === piGroup.pi.id
                          )
                        )
                        .map((matkul) => (
                          <div key={matkul.id}>{matkul.nama}</div>
                        ));

                    return [
                      <td
                        key={`${tingkat}-ganjil-${piGroup.pi.id}`}
                        className="border px-2 py-2"
                      >
                        {renderMatkul(ganjilMatkul)}
                      </td>,
                      <td
                        key={`${tingkat}-genap-${piGroup.pi.id}`}
                        className="border px-2 py-2"
                      >
                        {renderMatkul(genapMatkul)}
                      </td>,
                    ];
                  })}
                </tr>
              ));
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TableAssessment;
