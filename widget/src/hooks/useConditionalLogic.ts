import { useCallback } from 'preact/hooks';
import { Formula, VariableValues } from '../utils/formulaHelpers';

export type ComparisonOperator = 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'equal' | 'not_equal';
export type LogicalOperator = 'and' | 'or';

export interface Condition {
    target?: string;
    targetType?: 'variable' | 'formula';
    formula?: string; // Legacy support
    operator: ComparisonOperator;
    value: string | number;
}

export interface ConditionalBlock {
    type: 'if' | 'elseif' | 'else';
    conditions?: Condition[];
    condition?: Condition; // Legacy single condition
    logicalOperator?: LogicalOperator;
    message: string;
    style: 'default' | 'success' | 'warning' | 'error';
}

export interface ConditionalLine {
    blocks: ConditionalBlock[];
}

export interface ConditionalResult {
    message: string;
    style: 'default' | 'success' | 'warning' | 'error';
}

/**
 * Custom hook for conditional logic evaluation.
 * 
 * @param variableValues - Current variable values
 * @param formulas - Array of formula definitions
 * @param evaluateFormula - Function to evaluate formula expressions
 * @returns Object containing conditional evaluation functions
 */
export const useConditionalLogic = (
    variableValues: VariableValues,
    formulas: Formula[],
    evaluateFormula: (expression: string) => number
) => {
    // Conditional evaluation operators
    const operators: Record<ComparisonOperator, (a: number, b: number) => boolean> = {
        'greater_than': (a, b) => a > b,
        'less_than': (a, b) => a < b,
        'greater_equal': (a, b) => a >= b,
        'less_equal': (a, b) => a <= b,
        'equal': (a, b) => a == b,
        'not_equal': (a, b) => a != b,
    };

    // Helper to evaluate a single condition
    const evaluateCondition = useCallback((condition: Condition): boolean => {
        let targetValue: number | null = null;

        // Handle new structure (target + targetType)
        if (condition.targetType === 'variable') {
            targetValue = variableValues[condition.target!] ?? 0;
        } else if (condition.targetType === 'formula') {
            const formula = formulas.find(f => f.name === condition.target);
            if (formula) {
                targetValue = evaluateFormula(formula.expression);
            }
        }
        // Handle legacy structure (formula only)
        else if (condition.formula) {
            const formula = formulas.find(f => f.name === condition.formula);
            if (formula) {
                targetValue = evaluateFormula(formula.expression);
            }
        }

        if (targetValue === null) return false;

        const conditionValue = parseFloat(String(condition.value));
        const operator = operators[condition.operator];

        return operator && operator(targetValue, conditionValue);
    }, [variableValues, formulas, evaluateFormula]);

    // Evaluate conditional line and return the matching block
    const evaluateConditionalLine = useCallback((line: ConditionalLine, parseResultContent: (content: string) => string): ConditionalResult | null => {
        if (!line.blocks || line.blocks.length === 0) return null;

        for (const block of line.blocks) {
            // Else block always matches
            if (block.type === 'else') {
                return { message: parseResultContent(block.message), style: block.style };
            }

            // Evaluate if/elseif condition
            let isMatch = false;

            if (block.conditions && block.conditions.length > 0) {
                // Multiple conditions with AND/OR
                if (block.logicalOperator === 'or') {
                    isMatch = block.conditions.some(evaluateCondition);
                } else {
                    // Default to AND
                    isMatch = block.conditions.every(evaluateCondition);
                }
            } else if (block.condition) {
                // Legacy single condition
                isMatch = evaluateCondition(block.condition);
            }

            if (isMatch) {
                return { message: parseResultContent(block.message), style: block.style };
            }
        }

        return null; // No condition matched
    }, [evaluateCondition]);

    return { evaluateCondition, evaluateConditionalLine };
};
