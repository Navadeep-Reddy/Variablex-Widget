import { Formula, VariableValues } from './formulaHelpers';

/**
 * Parses result content and replaces variable and formula placeholders.
 * 
 * Supports two types of placeholders:
 * - {variable_name} - Replaced with the current value of the variable
 * - {formula:formula_name} - Replaced with the evaluated result of the formula
 * 
 * @param content - The content string with placeholders
 * @param variableValues - Current variable values
 * @param formulas - Array of formula definitions
 * @param evaluateFormula - Function to evaluate a formula expression
 * @returns Parsed content with substituted values
 */
export const parseResultContent = (
    content: string,
    variableValues: VariableValues,
    formulas: Formula[],
    evaluateFormula: (expression: string) => number
): string => {
    if (!content) return '';

    // Replace variable placeholders {variable_name}
    let parsed = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (match, varName) => {
        const value = variableValues[varName];
        return value !== undefined && value !== null ? String(value) : match;
    });

    // Replace formula placeholders {formula:formula_name}
    parsed = parsed.replace(/\{formula:([^}]+)\}/g, (match, formulaName) => {
        const formula = formulas.find(f => f.name === formulaName);
        if (!formula) {
            return match;
        }

        const result = evaluateFormula(formula.expression);

        if (result === null) return match;

        // Check if result is a number before calling toFixed
        return typeof result === 'number' ? result.toFixed(2) : String(result);
    });

    return parsed;
};
