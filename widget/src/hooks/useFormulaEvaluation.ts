import { useCallback } from 'preact/hooks';
import { Parser } from 'expr-eval';
import { Formula, VariableValues, sanitizeExpression, buildScopeWithFormulas, setDefaultVariableValues } from '../utils/formulaHelpers';

/**
 * Custom hook for formula evaluation.
 * 
 * @param variableValues - Current variable values
 * @param formulas - Array of formula definitions
 * @returns Object containing the evaluateFormula function
 */
export const useFormulaEvaluation = (
    variableValues: VariableValues,
    formulas: Formula[]
) => {
    const evaluateFormula = useCallback((expression: string): number => {
        try {
            const parser = new Parser();

            // Sanitize expression: replace non-breaking spaces and other Unicode whitespace with regular spaces
            const sanitizedExpression = sanitizeExpression(expression);

            // Create scope with variable values, defaulting to 0 for missing variables
            const scope: VariableValues = { ...variableValues };

            // Extract all variables from the expression and set defaults
            setDefaultVariableValues(sanitizedExpression, scope);

            // Build scope with evaluated formulas
            const fullScope = buildScopeWithFormulas(scope, formulas, parser);

            const result = parser.evaluate(sanitizedExpression, fullScope);
            return typeof result === 'number' ? result : 0;
        } catch (error) {
            console.error('Formula evaluation error:', error);
            return 0; // Return 0 instead of 'Error' for better UX
        }
    }, [variableValues, formulas]);

    return { evaluateFormula };
};
