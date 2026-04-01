'use client';
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import TagBadge from "@/components/ui/TagBadge";

export default function TagInput({ value = [], onChange }){
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
            if(containerRef.current && !containerRef.current.contains(e.target)) {
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
                const res = await api.get("/tags/", { params: { search: query } });
                const filtered = res.filter((tag) => !selectedIdsRef.current.has(tag.id));
                setOptions(filtered);
                setIsOpen(filtered.length > 0);
            } catch(error) {
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
        <div ref={containerRef} className="">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => options.length > 0 && setIsOpen(true)}
                placeholder="Search tag..."
                className="border border-default-medium rounded-base px-3 py-2 w-full text-sm focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
            />
            {isLoading && (
                <span>
                    Loading...
                </span>
            )}

            {isOpen &&(
                <ul className="absolute z-10 mt-1 w-full bg-white border border-default-medium rounded-xl shadow-md max-h-48 overflow-y-auto">
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
                <div className="flex flex-wrap gap-1.5 mb-2">
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

            {error && (
                <p className="text-red-600 mt-1 text-sm">
                    {error.message}
                </p>
            )}
        </div>
    )
}