interface BaseComponentProps {
    id: string;
    label?: string;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
}

interface NumberInputRendererProps extends BaseComponentProps {
    value: number;
    onChange: (value: number) => void;
}

interface SliderRendererProps extends BaseComponentProps {
    value: number;
    onChange: (value: number) => void;
}

/**
 * Renders a number input component with optional prefix and suffix.
 */
export const NumberInputRenderer = ({
    id,
    label,
    prefix,
    suffix,
    min,
    max,
    step,
    value,
    onChange
}: NumberInputRendererProps) => {
    const handleIncrement = () => {
        const newValue = value + (step || 1);
        if (max === undefined || newValue <= max) {
            onChange(newValue);
        }
    };

    const handleDecrement = () => {
        const newValue = value - (step || 1);
        if (min === undefined || newValue >= min) {
            onChange(newValue);
        }
    };

    return (
        <div key={id} className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
                {label}
            </label>
            <div className="flex items-center gap-2">
                {prefix && (
                    <span className="text-sm font-medium text-foreground">{prefix}</span>
                )}
                <div className="relative flex-1">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))}
                        placeholder="Enter number"
                        min={min}
                        max={max}
                        step={step}
                        className="w-full px-3 py-2 pr-7 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary number-input-no-spinner"
                    />
                    <div className="absolute right-0 top-0 h-full flex flex-col border-l border-border rounded-r-md overflow-hidden">
                        <button
                            type="button"
                            onClick={handleIncrement}
                            className="flex-1 px-1.5 hover:bg-muted/50 transition-colors border-b border-border flex items-center justify-center"
                        >
                            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleDecrement}
                            className="flex-1 px-1.5 hover:bg-muted/50 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
                {suffix && (
                    <span className="text-sm font-medium text-foreground">{suffix}</span>
                )}
            </div>
        </div>
    );
};

/**
 * Renders a slider component with value display and optional prefix/suffix.
 */
export const SliderRenderer = ({
    id,
    label,
    prefix,
    suffix,
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange
}: SliderRendererProps) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div key={id} className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
                {label}
            </label>
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb"
                        style={{
                            background: `linear-gradient(to right, #000 0%, #000 ${percentage}%, #d1d5db ${percentage}%, #d1d5db 100%)`
                        }}
                    />
                    <style>{`
            .slider-thumb::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #000;
              cursor: pointer;
              border: 2px solid #fff;
              box-shadow: 0 0 0 1px #000;
            }
            .slider-thumb::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
            }
            .slider-thumb::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #000;
              cursor: pointer;
              border: 2px solid #fff;
              box-shadow: 0 0 0 1px #000;
            }
            .slider-thumb::-moz-range-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
            }
          `}</style>
                </div>
                <div className="flex items-center gap-1 min-w-[80px] px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md justify-center">
                    {prefix && (
                        <span className="text-sm font-semibold text-gray-900">{prefix}</span>
                    )}
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                    {suffix && (
                        <span className="text-sm font-semibold text-gray-900">{suffix}</span>
                    )}
                </div>
            </div>
        </div>
    );
};
