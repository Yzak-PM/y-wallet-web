
export default function TagBadge({ tag, deleteIcon = false, onClick = () => {} }){
    return (
        <span 
            className={`inline-flex items-center px-2 py-0.5 rounded-full ` + (deleteIcon ? `cursor-pointer text-sm` : `text-xs`)}
            onClick={onClick}
            style={{ background: tag.color + "22", color: tag.color, border: "1px solid " + tag.color + "44" }}
        >
            {tag.name} {deleteIcon && 
                <svg 
                    className="w-3 h-3 ms-1" 
                    aria-hidden="true" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                        <path 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
                }
        </span>
    )
}