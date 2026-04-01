"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AccountsTable from "@/components/accounts/accountsTable";
import LogoutBtn  from "@/components/ui/LogoutBtn";
import TransactionsList from "@/components/transactions/TransactionsList";
import AddTransactionBtn from "@/components/transactions/AddTransactionBtn";

export default function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/finance/summary/")
        .then(setSummary)
        .catch((err) => setError(err.messsage))
        .finally(() => setLoading(false));
    }, []);

    const format = (amount) =>
        new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

    return (
        <main className="min-h-screen bg-neutral-50 py-3 px-6">
            <div className="mx-auto flex flex-col">
                <div className="hidden sm:flex flex-row justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">Y-Wallet</h1>
                        <p className="text-xs text-neutral-400">Finance Dashboard</p>
                    </div>
                    <LogoutBtn/>
                </div>

                <hr className="hidden sm:block mt-2 mb-4 text-gray-400"/>

                <div className="flex flex-col justify-center text-center mb-4">
                    <p className="text-xs text-neutral-400">NET WORTH</p>
                    <h1 className="text-3xl font-medium">
                        { loading ? "Loading..." : error ? "Error" : format(summary.net_worth)}
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row justify-start items-center gap-1 mb-4">
                    <select id="" className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 text-sm rounded-full focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
                        <option value="">All categories</option>
                    </select>
                    <div className="flex flex-row gap-1">
                        <input type="date" id="simple-search" className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 rounded-full text-sm focus:ring-brand focus:border-brand shadow-xs"/>
                        <input type="date" id="simple-search" className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 rounded-full text-sm focus:ring-brand focus:border-brand shadow-xs"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-xs uppercase text-neutral-500 mb-0 pb-0">Assets</p>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-500 inset-ring inset-ring-blue-500">
                                { loading ? "Loading..." : error ? "Error" : format(summary.assets)}
                            </span>
                        </div>
                        <AccountsTable nature="asset" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-xs uppercase text-neutral-500 mb-0 pb-0">Liabilities</p>
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-500 inset-ring inset-ring-red-500">
                                { loading ? "Loading..." : error ? "Error" : format(summary.liabilities)}
                            </span>
                        </div>
                        <AccountsTable nature="liability" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {/* Transacciones */}
                    <div className="flex flex-col md:col-span-3">
                        <p className="text-xs uppercase text-neutral-500 mb-1">Transactions</p>
                        <div className="rounded-xl ">
                            <TransactionsList/>
                        </div>
                    </div>

                    {/* Gráfica */}
                    <div className="flex flex-col md:col-span-2">
                        <p className="text-xs uppercase text-neutral-500 mb-1">Overview</p>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            {/* chart aquí */}
                        </div>
                    </div>
                </div>
            </div>

            <AddTransactionBtn/>
        </main>
    );
}