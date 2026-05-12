export default function CustomInput({ type, value, onChange, ...props }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 rounded-full text-sm focus:ring-brand focus:border-brand shadow-xs"
            {...props}
        />
    );
}