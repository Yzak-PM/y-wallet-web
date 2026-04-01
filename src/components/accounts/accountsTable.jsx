"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AccountsTable({ nature }){
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/accounts")
            .then(setAccounts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-lg border border-gray-200">
            <table className="w-full text-sm text-center rtl:text-right text-body">
                <thead className={`text-sm text-body ${nature === 'asset' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    <tr>
                    {accounts.filter(a => a.nature === nature).map((account) => (
                        <th key={account.id} className="px-6 py-3 font-semibold">{account.name}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-neutral-primary border-default">
                    {accounts.filter(a => a.nature === nature).map((account) => (
                        <td
                            key={account.id}
                            className="px-4 py-3"
                            // style={{
                            //     borderBottom: `3px solid ${account.color}`,
                            // }}
                        >
                            $ {account.balance}
                            <div
                                className="mt-1 mx-auto rounded-full"
                                style={{
                                backgroundColor: account.color,
                                height: '3px',
                                width: '100%'
                                }}
                            />
                        </td>
                    ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}