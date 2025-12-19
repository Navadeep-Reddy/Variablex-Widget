interface Option {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
}

interface TextBlockInputProps {
    label: string;
    options: Option[];
    value: number;
    onChange: (value: number) => void;
}

const TextBlockInput = ({ label, options, value, onChange }: TextBlockInputProps) => {
    const selectedIndex = options.findIndex(opt => opt.value === value);
    const gridCols = Math.min(options.length, 4);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">{label}</label>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                {options.map((option, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`px-4 py-3 border-2 border-solid rounded text-sm font-medium transition-colors ${idx === selectedIndex
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary/50'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TextBlockInput;
