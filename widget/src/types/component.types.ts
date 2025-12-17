/**
 * Component type definitions
 */

export interface ComponentOption {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
}

export interface BaseComponent {
    id: string;
    type: string;
    label: string;
    variableName?: string;
}

export interface NumberInputComponent extends BaseComponent {
    type: 'numberInput';
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    prefix: string;
    suffix: string;
}

export interface SliderComponent extends BaseComponent {
    type: 'slider';
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    prefix: string;
    suffix: string;
}

export interface SelectComponent extends BaseComponent {
    type: 'dropdown' | 'radio' | 'textBlock' | 'categorical';
    options: ComponentOption[];
    defaultValue: number;
}

export interface TextComponent extends BaseComponent {
    type: 'text';
    text: string;
    value: number;
    fontSize?: string;
    textAlign?: string;
}

export interface CheckboxOption {
    id: string;
    label: string;
    variableName: string;
    checkedValue: number;
    uncheckedValue: number;
    defaultValue: number;
}

export interface CheckboxesComponent extends BaseComponent {
    type: 'checkboxes';
    mode: 'normal' | 'advanced';
    aggregationFunction?: 'sum'; // Only for normal mode
    aggregatedVariableName?: string; // Only for normal mode
    options: CheckboxOption[];
}

export interface ResultRegularComponent extends BaseComponent {
    type: 'resultRegular';
    content: string;
    style: string;
    fontSize?: string;
    textAlign?: string;
}

export interface ResultConditionalComponent extends BaseComponent {
    type: 'resultConditional';
    blocks: any[];
    fontSize?: string;
    textAlign?: string;
}

export type Component =
    | NumberInputComponent
    | SliderComponent
    | SelectComponent
    | TextComponent
    | CheckboxesComponent
    | ResultRegularComponent
    | ResultConditionalComponent;
