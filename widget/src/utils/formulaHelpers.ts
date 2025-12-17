import { Parser } from 'expr-eval';

export interface Formula {
    name: string;
    expression: string;
}

export interface VariableValues {
    [key: string]: number;
}

/**
 * Sanitizes expression by replacing non-breaking spaces and Unicode whitespace with regular spaces.
 * This fixes issues with contentEditable divs that insert &nbsp; (U+00A0) characters.
 */
export const sanitizeExpression = (expression: string): string => {
    return expression.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ');
};

/**
 * Builds a scope object with variable values and evaluated formulas.
 * Iteratively evaluates formulas to handle dependencies between formulas.
 * 
 * @param variableValues - Current variable values
 * @param formulas - Array of formula definitions
 * @param parser - expr-eval Parser instance
 * @returns Scope object with all variables and evaluated formulas
 */
export const buildScopeWithFormulas = (
    variableValues: VariableValues,
    formulas: Formula[],
    parser: Parser
): VariableValues => {
    // Create scope with variable values, defaulting to 0 for missing variables
    const scope: VariableValues = { ...variableValues };

    // Evaluate all formulas and add them to scope
    // This ensures that formulas can reference other formulas
    const evaluatedFormulas = new Set<string>();
    const maxIterations = formulas.length * 2; // Prevent infinite loops
    let iterations = 0;

    while (evaluatedFormulas.size < formulas.length && iterations < maxIterations) {
        iterations++;
        let progressMade = false;

        formulas.forEach(formula => {
            if (evaluatedFormulas.has(formula.name)) return;

            try {
                // Try to evaluate this formula with current scope
                // Sanitize the formula expression as well
                const sanitizedFormulaExpr = sanitizeExpression(formula.expression);
                scope[formula.name] = parser.evaluate(sanitizedFormulaExpr, scope);
                evaluatedFormulas.add(formula.name);
                progressMade = true;
            } catch (error) {
                // If evaluation fails, it might be because a dependency isn't ready yet
                // We'll try again in the next iteration
                // If it still fails after all iterations, default to 0
            }
        });

        if (!progressMade) {
            // No progress made, set remaining formulas to 0
            formulas.forEach(formula => {
                if (!evaluatedFormulas.has(formula.name)) {
                    scope[formula.name] = 0;
                    evaluatedFormulas.add(formula.name);
                }
            });
            break;
        }
    }

    return scope;
};

/**
 * Extracts all variable names from an expression and sets default values in scope.
 * 
 * @param expression - The expression to extract variables from
 * @param scope - The scope object to update with default values
 */
export const setDefaultVariableValues = (expression: string, scope: VariableValues): void => {
    const variablePattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const foundVariables = expression.match(variablePattern) || [];

    foundVariables.forEach(varName => {
        if (scope[varName] === undefined) {
            scope[varName] = 0; // Default to 0 for missing variables
        }
    });
};
