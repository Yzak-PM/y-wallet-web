export default function TableSkeleton() {
    return (
        <div role="status" className="animate-pulse">
            <table className="w-full border border-gray-300">
                <thead className="border border-gray-300">
                    <tr>
                        {Array.from({ length: 3 }).map((_, i) => (
                        <th key={i} className="px-4 py-3">
                            <div className="h-2.5 bg-gray-300 rounded-full w-24"></div>
                        </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 2 }).map((_, row) => (
                        <tr key={row} className="border-t border-gray-100">
                        {Array.from({ length: 3 }).map((_, col) => (
                            <td key={col} className="px-4 py-3">
                            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                            </td>
                        ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <span className="sr-only">Loading...</span>
        </div>
    )
}