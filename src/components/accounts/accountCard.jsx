import { Trash2Icon } from "lucide-react";
import { PencilIcon } from "lucide-react";

const accountTypeClasses = {
  cash: "text-green-600 border-2 border-green-600 bg-green-100 px-2 rounded-full",
  bank: "text-blue-600 border-2 border-blue-600 bg-blue-100 px-2 rounded-full",
  credit: "text-orange-600 border-2 border-orange-600 bg-orange-100 px-2 rounded-full",
  loan: "text-red-600 border-2 border-red-600 bg-red-100 px-2 rounded-full",
  savings: "text-sky-600 border-2 border-sky-600 bg-sky-100 px-2 rounded-full",
}

const accountNatureClasses = {
  asset: "text-white bg-cyan-600 px-2 rounded-full",
  liability: "text-white bg-orange-600 px-2 rounded-full",
}

export default function AccountCard({ account, onEdit, onDelete }) { 
  return (
    <div className="p-3 border border-neutral-300 shadow-lg rounded-lg">
      <div className="flex justify-between mb-3">
        <div className="flex gap-1.5 items-center">
          <span className="rounded-full h-3 w-3 shadow-md" style={{ backgroundColor: account.color }}>&nbsp;</span>
          <h3 className="font-medium text-md">{account.name}</h3>
        </div>
        <div className="flex gap-2">
          <span 
            onClick={onEdit}
            className="p-1 bg-gray-200 md:opacity-50 hover:opacity-100 rounded-md cursor-pointer"
          >
            <PencilIcon className="text-blue-600" size={23} />
          </span>
          <span
            onClick={onDelete}
            className="p-1 bg-red-100 md:opacity-50 hover:opacity-100 rounded-md cursor-pointer"
          >
            <Trash2Icon className="text-red-700 " size={23} />
          </span>
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <div className="flex gap-2">
          <span className={accountNatureClasses[account.nature] ?? ""}>{account.nature}</span>
          <span className={accountTypeClasses[account.type] ?? ""}>{account.type}</span>
        </div>
        <p className="text-neutral-600">$ {account.balance}</p>
      </div>
    </div>
  )
}