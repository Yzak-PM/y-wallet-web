"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AccountsTable from "@/components/accounts/accountsTable";
import LogoutBtn  from "@/components/ui/LogoutBtn";
import TransactionsList from "@/components/transactions/TransactionsList";
import AddTransactionBtn from "@/components/transactions/AddTransactionBtn";
import SpendingByCatChart from "@/components/graphs/SpendingByCat";
import CustomInput from "@/components/ui/CustomInput";
import SimpleSkeleton from "@/components/ui/SimpleSkeleton";
import MessageContainer from "@/components/ui/MessageContainer";
import UserBadge from "@/components/ui/UserBadge";

export default function DashboardPage() {
    const now = new Date();
    const toLocalYMD = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };
    const firstDay = toLocalYMD(new Date(now.getFullYear(), now.getMonth(), 1));
    const lastDay  = toLocalYMD(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [errorSummary, setErrorSummary] = useState(null);
    const [categorySelected, setCategorySelected] = useState("");
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    useEffect(() => {
        api.get("/finance/summary/")
        .then(setSummary)
        .catch((err) => setErrorSummary(err.messsage))
        .finally(() => setLoadingSummary(false));
    }, []);

    useEffect(() => {
        api.get("/categories/")
        .then((data) => {
            setCategories(data);
        })
        .catch((err) => setErrorCategories(err.message))
        .finally(() => setLoadingCategories(false));
    }, []);

    const format = (amount) =>
        new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

    return (
        <main className="min-h-screen bg-neutral-50 py-3 px-6">
            <div className="mx-auto flex flex-col">
                <div className="flex flex-row justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-neutral-600">Y-Wallet</h1>
                        {/* <p className="text-xs text-neutral-400">Finance Dashboard</p> */}
                    </div>
                    <UserBadge />
                </div>

                <hr className="mt-2 text-gray-300"/>

                <div className="flex flex-col justify-center text-center mt-3 mb-5">
                    <p className="text-xs text-neutral-400">NET WORTH</p>
                    { loadingSummary 
                        ? <SimpleSkeleton width="100" position="center" />
                        : errorSummary
                            ? <MessageContainer title="Something went wrong" msg={errorSummary} type="error"/>
                            : <h1 className="text-6xl font-semibold">{format(summary.net_worth)}</h1>
                    }
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-xs uppercase text-neutral-500 mb-0 pb-0">Assets</p>
                            { loadingSummary 
                                ? <SimpleSkeleton width="10" position="center" />
                                : errorSummary
                                    ? <MessageContainer title="Something went wrong" msg={errorSummary} type="error"/>
                                    : <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-500 inset-ring inset-ring-blue-500">{format(summary.assets)}</span>
                            }
                        </div>
                        <AccountsTable nature="asset" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-xs uppercase text-neutral-500 mb-0 pb-0">Liabilities</p>
                            { loadingSummary 
                                ? <SimpleSkeleton width="10" position="center" />
                                : errorSummary
                                    ? <MessageContainer title="Something went wrong" msg={errorSummary} type="error"/>
                                    : <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-500 inset-ring inset-ring-red-500">{format(summary.liabilities)}</span>
                            }
                        </div>
                        <AccountsTable nature="liability" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-start items-center gap-1 mb-4">
                    <select
                        id=""
                        disabled={loadingCategories || !!errorCategories}
                        onChange={(e) => setCategorySelected(e.target.value)}
                        className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 text-sm rounded-full focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                    >
                    {loadingCategories
                        ? <option value="">Loading...</option>
                        : errorCategories
                            ? <option value="">Error: {errorCategories}</option>
                            : <>
                                <option value="">All categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.title}</option>
                                ))}
                            </>
                    }
                    </select>
                    <div className="flex flex-row gap-1">
                        <CustomInput
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <CustomInput
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {/* Transacciones */}
                    <div className="flex flex-col md:col-span-3">
                        <p className="text-xs uppercase text-neutral-500 mb-1">Transactions</p>
                        <div className="rounded-xl max-h-[calc(100vh-430px)] overflow-auto">
                            <TransactionsList
                                startDate={startDate}
                                endDate={endDate}
                                category={categorySelected}
                            />
                        </div>
                    </div>

                    {/* Gráfica */}
                    <div className="flex flex-col md:col-span-2">
                        <p className="text-xs uppercase text-neutral-500 mb-1">Overview</p>
                        <div className="bg-white rounded-xl h-[calc(100vh-430px)] shadow-md">
                            <SpendingByCatChart
                                startDate={startDate}
                                endDate={endDate}
                                category={categorySelected}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AddTransactionBtn/>
        </main>
    );
}