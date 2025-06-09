import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

const TableMatkul = ({ data, onEdit, onDelete, isEditable }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">No</th>
            <th className="px-6 py-3">Nama Mata Kuliah</th>
            <th className="px-6 py-3 text-center">Kode Mata Kuliah</th>
            <th className="px-6 py-3 text-center">Jumlah SKS</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {index + 1}
              </td>
              <td className="px-6 py-4">{item.nama_matkul}</td>
              <td className="px-6 py-4 text-center">{item.kode_matkul}</td>
              <td className="px-6 py-4 text-center">{item.jumlah_sks}</td>
              <td className="px-6 py-4 text-right space-x-2">
                {isEditable && (
                  <>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:underline dark:text-blue-500"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5 inline text-gray-500" />
                    </button>
                    <button
                      onClick={() => onDelete(item.matkul_id)}
                      className="text-red-600 hover:underline dark:text-red-500"
                      title="Hapus"
                    >
                      <TrashIcon className="h-5 w-5 inline text-gray-500" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableMatkul;
