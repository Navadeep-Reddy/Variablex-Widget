import { Component } from './component.types';
import { Formula, ConditionalBlock } from './conditional.types';

export interface CalculatorSchema {
    id: string;
    name: string;
    description?: string;
    layout: Section[];
    components: Component[];
    formulas: Formula[];
}

export interface Section {
    id: string;
    type: 'input' | 'result';
    name?: string;
    rows?: Row[];
    content?: string;
    style?: string;
    blocks?: ConditionalBlock[];
}

export interface Row {
    id: string;
    columns: Column[];
}

export interface Column {
    id: string;
    components: string[];
}
