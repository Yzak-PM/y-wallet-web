'use client';
import { XIcon } from "lucide-react";

const colorMap = {
  green: { text: "text-green-700", bg: "bg-green-100", },
  red: { text: "text-red-700", bg: "bg-red-100"    },
  blue: { text: "text-blue-700", bg: "bg-blue-100"   },
  yellow: { text: "text-yellow-700", bg: "bg-yellow-100" },
  cyan: { text: "text-cyan-700", bg: "bg-cyan-100"   },
};

export default function Toast({ icon, color, msg, onClose, leaving }) {
  const colors = colorMap[color] ?? colorMap.blue;

  return (
    <div className={`flex justify-between items-center w-full max-w-xs p-4 ${colors.bg} rounded-xl shadow-md border border-neutral-300 ${leaving ? "animate-slide-out" : "animate-slide-in"}`}>
      <div className="flex items-center gap-2">
        <span className={`${colors.text} ${colors.bg} p-1 rounded-md`}>{icon}</span>
        <div className="text-sm">{msg}</div>
      </div>
      <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 ms-3">
        <XIcon size={16} />
      </button>
    </div>
  );
}