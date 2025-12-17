import { NumberInputRenderer, SliderRenderer } from './InputComponents';
import { CategoricalRenderer, CategoricalOption } from './CategoricalRenderer';
import { RegularResult, ConditionalResult } from './ResultRenderer';
import CheckboxInput from '../CheckboxInput';
import { VariableValues } from '../../utils/formulaHelpers';
import { ConditionalBlock } from '../../hooks/useConditionalLogic';
import { ResultStyle, getResultStyleClass } from '../../utils/styleHelpers';
import { CheckboxOption } from '../../types/component.types';

export interface ComponentData {
    id: string;
    type: string;
    label?: string;
    variableName?: string;
    defaultValue?: number;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    displayType?: 'dropdown' | 'radio' | 'textBlock';
    options?: CategoricalOption[] | CheckboxOption[];
    mode?: 'normal' | 'advanced';
    aggregatedVariableName?: string;
    text?: string;
    fontSize?: string;
    textAlign?: string;
    content?: string;
    style?: ResultStyle;
    blocks?: ConditionalBlock[];
}

interface ComponentRendererProps {
    component: ComponentData;
    variableValues: VariableValues;
    updateVariable: (name: string, value: number) => void;
    parseResultContent: (content: string) => string;
    evaluateConditionalLine: (line: { blocks: ConditionalBlock[] }, parseResultContent: (content: string) => string) => { message: string; style: ResultStyle } | null;
}

/**
 * Main component renderer that delegates to specific renderers based on component type.
 */
export const ComponentRenderer = ({
    component: comp,
    variableValues,
    updateVariable,
    parseResultContent,
    evaluateConditionalLine
}: ComponentRendererProps) => {
    if (!comp) return null;

    const value = variableValues[comp.variableName!] ?? comp.defaultValue ?? 0;

    const handleChange = (newValue: number) => {
        updateVariable(comp.variableName!, newValue);
    };

    switch (comp.type) {
        case 'numberInput':
            return (
                <NumberInputRenderer
                    id={comp.id}
                    label={comp.label}
                    prefix={comp.prefix}
                    suffix={comp.suffix}
                    min={comp.min}
                    max={comp.max}
                    step={comp.step}
                    value={value}
                    onChange={handleChange}
                />
            );

        case 'slider':
            return (
                <SliderRenderer
                    id={comp.id}
                    label={comp.label}
                    prefix={comp.prefix}
                    suffix={comp.suffix}
                    min={comp.min}
                    max={comp.max}
                    step={comp.step}
                    value={value}
                    onChange={handleChange}
                />
            );

        case 'checkboxes': {
            // Gather all option values
            const values: { [key: string]: number } = {};
            (comp.options as CheckboxOption[])?.forEach(opt => {
                values[opt.variableName] = variableValues[opt.variableName] ?? opt.defaultValue ?? 0;
            });

            const handleCheckboxChange = (variableName: string, newValue: number) => {
                updateVariable(variableName, newValue);

                // If in normal mode, update aggregated variable
                if (comp.mode === 'normal' && comp.aggregatedVariableName) {
                    // Calculate sum of all checkbox values
                    let sum = 0;
                    (comp.options as CheckboxOption[]).forEach(opt => {
                        const val = opt.variableName === variableName
                            ? newValue
                            : (variableValues[opt.variableName] ?? opt.defaultValue ?? 0);
                        sum += val;
                    });
                    updateVariable(comp.aggregatedVariableName, sum);
                }
            };

            return (
                <CheckboxInput
                    key={comp.id}
                    label={comp.label ?? ''}
                    options={(comp.options as CheckboxOption[]) || []}
                    values={values}
                    onChange={handleCheckboxChange}
                />
            );
        }

        case 'dropdown':
            return (
                <CategoricalRenderer
                    id={comp.id}
                    label={comp.label}
                    displayType="dropdown"
                    options={(comp.options as CategoricalOption[]) || []}
                    value={value}
                    onChange={handleChange}
                />
            );

        case 'radio':
            return (
                <CategoricalRenderer
                    id={comp.id}
                    label={comp.label}
                    variableName={comp.variableName}
                    displayType="radio"
                    options={(comp.options as CategoricalOption[]) || []}
                    value={value}
                    onChange={handleChange}
                />
            );

        case 'textBlock':
            return (
                <CategoricalRenderer
                    id={comp.id}
                    label={comp.label}
                    displayType="textBlock"
                    options={(comp.options as CategoricalOption[]) || []}
                    value={value}
                    onChange={handleChange}
                />
            );

        case 'categorical': {
            const displayType = comp.displayType || 'dropdown';
            return (
                <CategoricalRenderer
                    id={comp.id}
                    label={comp.label}
                    variableName={comp.variableName}
                    displayType={displayType}
                    options={(comp.options as CategoricalOption[]) || []}
                    value={value}
                    onChange={handleChange}
                />
            );
        }

        case 'text': {
            const fontSizeClass = {
                'small': 'text-sm',
                'medium': 'text-base',
                'large': 'text-lg',
                'xlarge': 'text-xl'
            }[comp.fontSize || 'medium'] || 'text-base';

            const textAlignClass = {
                'left': 'text-left',
                'center': 'text-center',
                'right': 'text-right'
            }[comp.textAlign || 'left'] || 'text-left';

            return (
                <div className="space-y-2">
                    <p className={`${fontSizeClass} ${textAlignClass}`}>{comp.text || 'Text Display'}</p>
                </div>
            );
        }

        case 'resultRegular': {
            const content = comp.content || '';
            const parsedContent = parseResultContent(content);
            const styleClass = getResultStyleClass(comp.style || 'default');

            return (
                <RegularResult
                    id={comp.id}
                    content={content}
                    style={comp.style || 'default'}
                    parsedContent={parsedContent}
                    styleClass={styleClass}
                    fontSize={comp.fontSize}
                    textAlign={comp.textAlign}
                />
            );
        }

        case 'resultConditional': {
            return (
                <ConditionalResult
                    id={comp.id}
                    blocks={comp.blocks || []}
                    parseResultContent={parseResultContent}
                    evaluateConditionalLine={evaluateConditionalLine}
                    getResultStyleClass={getResultStyleClass}
                    fontSize={comp.fontSize}
                    textAlign={comp.textAlign}
                />
            );
        }

        default:
            return null;
    }
};
