import { TriangleAlertIcon, FolderIcon } from "lucide-react";

export default function MessageContainer({ title, msg, type }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 py-10 ${type === "error" ? "text-red-600" : "text-black"}`}
    >
      <span
        className={`${type === "error" ? "bg-red-200 text-red-700" : "bg-blue-200 text-blue-700"} p-2 rounded-md`}
      >
        {type == "error" ? (
          <TriangleAlertIcon size={25} />
        ) : (
          <FolderIcon size={25} />
        )}
      </span>
      <p
        className={`text-md font-medium ${type === "error" ? "text-red-600" : "text-black"}`}
      >
        {title}
      </p>
      <p className="text-sm text-neutral-500">{msg}</p>
      {type == "error" && (
        <p className="text-xs text-neutral-500">Please try again later</p>
      )}
    </div>
  );
}
