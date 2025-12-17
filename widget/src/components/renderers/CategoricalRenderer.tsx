import DropdownInput from '../DropdownInput';
import RadioInput from '../RadioInput';
import TextBlockInput from '../TextBlockInput';

export interface CategoricalOption {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
}

interface CategoricalRendererProps {
    id: string;
    label?: string;
    variableName?: string;
    displayType: 'dropdown' | 'radio' | 'textBlock';
    options: CategoricalOption[];
    value: number;
    onChange: (value: number) => void;
}

/**
 * Renders a categorical component based on the display type.
 * Supports dropdown, radio, and textBlock display types.
 */
export const CategoricalRenderer = ({
    id,
    label,
    variableName,
    displayType,
    options,
    value,
    onChange
}: CategoricalRendererProps) => {
    if (displayType === 'dropdown') {
        return (
            <DropdownInput
                key={id}
                label={label ?? ''}
                options={options}
                value={value}
                onChange={onChange}
            />
        );
    }

    if (displayType === 'radio') {
        return (
            <RadioInput
                key={id}
                label={label ?? ''}
                variableName={variableName ?? ''}
                options={options}
                value={value}
                onChange={onChange}
            />
        );
    }

    if (displayType === 'textBlock') {
        return (
            <TextBlockInput
                key={id}
                label={label ?? ''}
                options={options}
                value={value}
                onChange={onChange}
            />
        );
    }

    return null;
};
