'use client';
import { api } from '../../lib/api';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { TagIcon, LogOutIcon, SettingsIcon, ShelvingUnitIcon, CreditCardIcon } from 'lucide-react';

export default function UserBadge() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await api.get("/api/users/me/");
                setUser(data);
            } catch(err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    const nameInitials = user
    ? (user.first_name?.[0] ?? "").toUpperCase() + (user.last_name?.[0] ?? "").toUpperCase()
    : "NA";

    //Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <div
                className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-400 rounded-full cursor-pointer"
                onClick={() => setOpen(prev => !prev)}
            >
                <span className="font-medium text-white">{ nameInitials }</span>
            </div>
            {open && (
                <div className="absolute right-0 z-10 min-w-47 bg-neutral-50 border border-neutral-400 rounded-xl shadow-2xl">
                    <div className="px-4 py-3 border-b border-neutral-400 text-sm text-heading">
                        <div className="flex justify-between items-center">
                            <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                            <Link href="/settings/profile" onClick={() => setOpen(false)} prefetch={false}>
                                <SettingsIcon className="cursor-pointer" />
                            </Link>
                        </div>
                        <div className="truncate mt-1">{user?.email}</div>
                    </div>
                    <ul className="p-2 text-sm font-medium" aria-labelledby="avatarButton">
                        <Link
                            prefetch={false}
                            href="/settings/accounts" 
                            onClick={() => setOpen(false)}
                            className="p-2 flex gap-1 cursor-pointer rounded-md hover:bg-blue-50"
                        >
                            <CreditCardIcon /> Accounts
                        </Link>
                        <Link
                            prefetch={false}
                            href="/settings/categories" 
                            onClick={() => setOpen(false)}
                            className="p-2 flex gap-1 cursor-pointer rounded-md hover:bg-blue-50"
                        >
                            <ShelvingUnitIcon /> Categories
                        </Link>
                        <Link 
                            prefetch={false}
                            href="/settings/categories"
                            onClick={() => setOpen(false)}
                            className="p-2 flex gap-1 cursor-pointer rounded-md hover:bg-blue-50"
                        >
                            <TagIcon /> Tags
                        </Link>
                        <li 
                            className="p-2 flex gap-1 cursor-pointer rounded-md hover:bg-blue-50"
                            onClick={() => api.logout()}
                        >
                            <LogOutIcon className="text-red-500" /> Log Out
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}