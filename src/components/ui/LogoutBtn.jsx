"use client";
import { api } from "@/lib/api";

export default function LogoutBtn() {
  return (
    <button
      onClick={() => api.logout()}
      className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
    >
      Sign out
    </button>
  );
}
