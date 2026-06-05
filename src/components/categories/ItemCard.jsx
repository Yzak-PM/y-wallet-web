import { PencilIcon, Trash2Icon } from "lucide-react";

export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div
      className="flex justify-between rounded-lg shadow-md p-1.5 items-center bg-white"
      style={{ border: '2px solid' + item.color, backgroundColor: item.color + '10' }}
    >
      <p className="text-sm">{item.icon} {item.name} {item.title}</p>
      <div className="flex gap-2">
        <span onClick={onEdit} className="p-1 bg-gray-200 md:opacity-50 hover:opacity-100 rounded-md cursor-pointer">
          <PencilIcon className="text-blue-600" size={23} />
        </span>
        <span onClick={onDelete} className="p-1 bg-red-100 md:opacity-50 hover:opacity-100 rounded-md cursor-pointer">
          <Trash2Icon className="text-red-700 " size={23} />
        </span>
      </div>
    </div>
  );
}