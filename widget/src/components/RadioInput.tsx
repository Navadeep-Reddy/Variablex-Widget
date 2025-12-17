interface Option {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
}

interface RadioInputProps {
    label: string;
    variableName: string;
    options: Option[];
    value: number;
    onChange: (value: number) => void;
}

const RadioInput = ({ label, variableName, options, value, onChange }: RadioInputProps) => {
    const selectedIndex = options.findIndex(opt => opt.value === value);

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">{label}</label>
            <div className="space-y-2">
                {options.map((option, idx) => (
                    <label
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-border cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                    >
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name={variableName}
                                value={option.value}
                                checked={idx === selectedIndex}
                                onChange={() => onChange(option.value)}
                                className="peer sr-only"
                            />
                            <div className="w-5 h-5 rounded-full border-2 border-border peer-checked:border-primary transition-all duration-200"></div>
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioInput;
