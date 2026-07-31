"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TransactionCard from "@/components/transactions/TransactionCard";
import CardSkeleton from "@/components/ui/CardSkeleton";
import MessageContainer from "@/components/ui/MessageContainer";

export default function TransactionsList({ startDate, endDate, category}) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/api/transactions/", {
                params: { start_date: startDate, end_date: endDate, category: category}
            })
            .then(setTransactions)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [startDate, endDate, category]);

    if (loading) return (
        <div role="status" className="rounded-lg animate-pulse md:p-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <CardSkeleton key={i} className="mb-3 bg-white" />
            ))}
        </div>
    );

    if (error) return (
        <MessageContainer type="error" title="Something went wrong" msg={error} />
    );

    if (!transactions.length) return (
        <MessageContainer type="warning" title="No transactions found" msg="Click '+' button to add a transaction" />
    );

    return (
        <>
            {transactions.map(tx => (
                <TransactionCard key={tx.id} tx={tx} />
            ))}
        </>
    );
}