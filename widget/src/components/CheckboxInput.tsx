import { CheckboxOption } from '../types/component.types';

interface CheckboxInputProps {
    label: string;
    options: CheckboxOption[];
    values: Record<string, number>;
    onChange: (variableName: string, value: number) => void;
}

const CheckboxInput = ({ label, options, values, onChange }: CheckboxInputProps) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">{label}</label>
            <div className="space-y-2">
                {options.map((option) => {
                    const value = values[option.variableName] ?? option.defaultValue;
                    const isChecked = value === option.checkedValue;

                    return (
                        <div key={option.id} className="flex items-center gap-3 p-3">
                            <input
                                type="checkbox"
                                id={option.id}
                                checked={isChecked}
                                onChange={(e) =>
                                    onChange(
                                        option.variableName,
                                        (e.target as HTMLInputElement).checked ? option.checkedValue : option.uncheckedValue
                                    )
                                }
                                className="w-5 h-5 cursor-pointer appearance-none border border-black bg-white checked:bg-black relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:left-[3px] checked:after:top-[-2px] checked:after:font-bold"
                            />
                            <label
                                htmlFor={option.id}
                                className="text-sm font-medium text-foreground cursor-pointer"
                            >
                                {option.label}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckboxInput;
