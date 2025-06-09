import { PlusIcon } from "@heroicons/react/outline"; // Gunakan Heroicons v1

const ButtonAdd = ({ onClick }) => {
  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={onClick}
        className="bg-blue-700 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ButtonAdd;
