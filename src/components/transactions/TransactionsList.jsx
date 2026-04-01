"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TransactionCard from "@/components/transactions/TransactionCard";

export default function TransactionsList() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/transactions/")
            .then(setTransactions)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-xs text-neutral-400 p-4">Loading...</p>;
    if (error)   return <p className="text-xs text-red-400 p-4">Error: {error}</p>;
    if (!transactions.length) return <p className="text-xs text-neutral-400 p-4">No transactions.</p>;

    return (
        <div>
            {transactions.map(tx => (
                <TransactionCard key={tx.id} tx={tx} />
            ))}
        </div>
    );
}