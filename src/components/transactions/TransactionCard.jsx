import "@/app/globals.css";
import TagBadge from "../ui/TagBadge";

const sign  = { expense: "-", income: "+", movement: "" };

export default function TransactionCard({ tx }) {
    const fmt = (n) =>
        new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

    const date = new Date(tx.date + 'T00:00:00').toLocaleDateString("es-MX", {
        month: "short", day: "numeric"
    });

    return (
        <div 
            className="flex items-center gap-3 px-4 py-3 mb-2 bg-white mb-4 rounded-lg shadow-md"
            style={{ borderLeft: "3px solid " + tx.account_color }}
        >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 text-xl"
                style={{ backgroundColor: tx.category_color }}
            >
                {tx.category_icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <span className="text-xs text-neutral-400">
                    {tx.category_title} ({date})
                </span>
                <p className="text-sm font-medium truncate">{tx.description}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {tx.tags.map(tag => (
                        <TagBadge key={tag.id} tag={tag}/>
                    ))}
                </div>
            </div>

            {/* Monto */}
            <div className="text-right flex-shrink-0">
                <p className={`text-sm font-medium ${
                    tx.type === "expense" ? "text-red-600" :
                    tx.type === "income"  ? "text-green-700" :
                    ""
                }`}>
                    {sign[tx.type]} {fmt(tx.amount)}
                </p>
            </div>
        </div>
    );
}