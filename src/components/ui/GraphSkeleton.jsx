export default function GraphSkeleton({className = ""}) {
    return (
        <div role="status" className="p-6 rounded-lg animate-pulse">
            <div className="bg-gray-300 rounded-full w-32 mb-2.5"></div>
            <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full"></div>
            <div className="flex items-baseline mt-4">
                <div className="w-full bg-gray-200 rounded-t-md h-22"></div>
                <div className="w-full h -26 ms-6 bg-gray-300 rounded-t-md"></div>
                <div className="w-full bg-gray-200 rounded-t-md h-22 ms-6"></div>
                <div className="w-full h-34 ms-6 bg-gray-300 rounded-t-md"></div>
                <div className="w-full bg-gray-200 rounded-t-md h-40 ms-6"></div>
                <div className="w-full bg-gray-300 rounded-t-md h-22 ms-6"></div>
                <div className="w-full bg-gray-200 rounded-t-md h-50 ms-6"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}