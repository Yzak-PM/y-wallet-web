import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useState, useEffect, startTransition } from 'react';
import { api } from '../../lib/api';
import MessageContainer from '../../components/ui/MessageContainer';
import GraphSkeleton from '../ui/GraphSkeleton';

export default function SpendingByCatChart({ startDate, endDate, category }) {
    const [state, setState] = useState({ data: [], loading: true, error: null });

    useEffect(() => {
        startTransition(() => { });

        api.get('/finance/expenses_by_category/', {
                params: { start_date: startDate, end_date: endDate, category: category }
            })
            .then(data => setState({ data, loading: false, error: null }))
            .catch(err => setState({ data: [], loading: false, error: err.message }));
    }, [startDate, endDate, category]);

    const { data: chartData, loading, error } = state;

    if (loading) return (
        <GraphSkeleton />
    );

    if (error) return (
        <MessageContainer type="error" title="Something went wrong" msg={error} />
    );

    if (!chartData || !chartData.length) return (
        <MessageContainer type="warning" title="No expenses found" msg="Click '+' button to add a expense" />
    );

    return (
        <div className="bg-surface rounded-full p-5 h-full">
            <h2 className="text-heading font-semibold mb-3">Expenses by category</h2>
            <ResponsiveContainer width="100%" height="95%">
                <BarChart data={chartData} margin={{ top:4, right: 16, left:0, bottom:4 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={(v) => `$${v}`}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Total']}
                        contentStyle={{ borderRadius: '8px' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry) => (
                            <Cell key={entry.category} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
