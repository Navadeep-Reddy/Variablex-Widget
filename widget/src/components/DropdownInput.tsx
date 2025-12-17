import { useState, useRef, useEffect } from 'preact/hooks';

interface Option {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
}

interface DropdownInputProps {
    label: string;
    options: Option[];
    value: number;
    onChange: (value: number) => void;
}

const DropdownInput = ({ label, options, value, onChange }: DropdownInputProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedIndex = options.findIndex(opt => opt.value === value);
    const selectedOption = options[selectedIndex] || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">{label}</label>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-2.5 pr-10 border-2 border-border rounded-lg bg-background text-foreground font-medium cursor-pointer transition-all duration-200 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-left"
                >
                    {selectedOption ? selectedOption.label : 'Select an option'}
                </button>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        className={`w-5 h-5 text-foreground/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {options.map((option, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 cursor-pointer transition-colors duration-150 ${idx === selectedIndex
                                    ? 'bg-gray-200 text-black font-medium'
                                    : 'text-black hover:bg-gray-600 hover:text-white'
                                    }`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropdownInput;
