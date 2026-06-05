export default function SimpleSkeleton({ position, width, className = "" }) {
    return (
        <div className={`h-3.5 animate-pulse bg-gray-300 rounded-full place-self-` + position + ` w-` + width + ` ` + className}></div>
    )
}