export default function CustomSelect({
    name, 
    value,
    onChange,
    options,
    disabled = false,
    className = "",
}) {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`rounded-full p-1 bg-neutral-100 ${className}`}
        >
            {options.map((opt) => (
                <option
                    key={opt.id}
                    value={opt.id}
                >
                    {opt.label}
                </option>
            ))}
        </select>
    )
}