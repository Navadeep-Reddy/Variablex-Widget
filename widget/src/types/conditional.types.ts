// Type definitions for conditional logic components

export type OperatorType = 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'equal' | 'not_equal';

export type BlockType = 'if' | 'elseif' | 'else';

export type StyleType = 'success' | 'warning' | 'error' | 'default';

export type LogicalOperator = 'and' | 'or';

export type TargetType = 'variable' | 'formula';

export interface Condition {
    id: string;
    target: string;
    targetType: TargetType;
    operator: OperatorType;
    value: string;
}

export interface ConditionalBlock {
    id: string;
    type: BlockType;
    message: string;
    style: StyleType;
    conditions?: Condition[];
    logicalOperator?: LogicalOperator;
    // Legacy fields for migration
    condition?: {
        formula?: string;
        target?: string;
        targetType?: TargetType;
        operator: OperatorType;
        value: string;
    };
}

export interface ConditionalLine {
    id: string;
    type: 'conditional';
    blocks: ConditionalBlock[];
}

export interface Variable {
    name: string;
    label: string;
}

export interface Formula {
    id: string;
    name: string;
    expression: string;
}

export interface Operator {
    value: OperatorType;
    label: string;
}
