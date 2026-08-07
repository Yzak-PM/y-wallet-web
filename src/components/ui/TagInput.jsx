"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import TagBadge from "@/components/ui/TagBadge";

export default function TagInput({ value = [], onChange }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  //Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Buscar tags en la API con debounce
  const selectedIdsRef = useRef(new Set());
  useEffect(() => {
    selectedIdsRef.current = new Set(value.map((t) => t.id));
  }, [value]);

  useEffect(() => {
    if (!query.trim()) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/tags/", { params: { search: query } });
        const filtered = res.filter(
          (tag) => !selectedIdsRef.current.has(tag.id),
        );
        setOptions(filtered);
        setIsOpen(filtered.length > 0);
      } catch (error) {
        setOptions([]);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function selectTag(tag) {
    onChange([...value, tag]);
    setQuery("");
    setOptions([]);
    setIsOpen(false);
  }

  function removeTag(tagId) {
    onChange(value.filter((tag) => tag.id !== tagId));
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => options.length > 0 && setIsOpen(true)}
        placeholder="Search tag..."
        className="border border-neutral-300 rounded-full px-3 py-1 w-full text-sm shadow-xs"
      />
      {isLoading && (
        <div className="absolute z-10 mt-1 bg-white border border-neutral-300 rounded-xl shadow-md w-full text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      )}

      {isOpen && (
        <ul className="absolute z-10 mt-1 bg-white border border-neutral-300 rounded-xl shadow-md max-h-48 w-full overflow-y-auto">
          {options.map((tag) => (
            <li key={tag.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectTag(tag)}
                className="w-full text-left px-3 py-2 text-sm text-heading hover:bg-brand/10 transition-colors"
              >
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2 mt-3">
          {value.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              deleteIcon={true}
              onClick={() => removeTag(tag.id)}
            />
          ))}
        </div>
      )}

      {error && <p className="text-red-600 mt-1 text-sm">{error.message}</p>}
    </div>
  );
}
