export default function SimpleSkeleton({ position, width }) {
    return (
        <div className={`h-3.5 bg-gray-200 rounded-full self-` + position + ` w-` + width}></div>
    )
}