import { useState, useRef, useEffect } from 'react';

export default function UserBadge({ 
    initials = "NA",
    name = "Not found",
    email = "user@test.com"
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    //Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
    }, []);

    return (
        <>
            <div
                data-dropdown-toggle="userDropdown" 
                data-dropdown-placement="bottom-start" 
                className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-400 rounded-full"
            >
                <span className="font-medium text-white">IP</span>
            </div>
            <div id="userDropdown" className="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                <div className="px-4 py-3 border-b border-default-medium text-sm text-heading">
                <div className="font-medium">Bonnie Green</div>
                <div className="truncate">name@flowbite.com</div>
                </div>
                <ul className="p-2 text-sm text-body font-medium" aria-labelledby="avatarButton">
                <li>
                    <a href="#" className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md">Dashboard</a>
                </li>
                <li>
                    <a href="#" className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md">Settings</a>
                </li>
                <li>
                    <a href="#" className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md">Earnings</a>
                </li>
                <li>
                    <a href="#" className="block w-full p-2 hover:bg-neutral-tertiary-medium text-fg-danger rounded-md">Sign out</a>
                </li>
                </ul>
            </div>
        </>
    )
}