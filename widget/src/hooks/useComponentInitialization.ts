import { useEffect } from 'preact/hooks';
import { Component, CheckboxOption } from '../types/component.types';
import { VariableValues } from '../utils/formulaHelpers';

/**
 * Custom hook to initialize component values on mount.
 * Sets default values for all components that have variables.
 * 
 * @param components - Array of component definitions
 * @param variableValues - Current variable values
 * @param updateVariable - Function to update a variable value
 */
export const useComponentInitialization = (
    components: Component[],
    variableValues: VariableValues,
    updateVariable: (name: string, value: number) => void
) => {
    useEffect(() => {
        components.forEach(comp => {
            // Initialize regular components with variableName
            if (comp.variableName && variableValues[comp.variableName] === undefined) {
                const defaultValue = (comp as any).defaultValue ?? 0;
                updateVariable(comp.variableName, defaultValue);
            }

            // Initialize checkbox components
            if (comp.type === 'checkboxes' && 'options' in comp) {
                const checkboxComp = comp as any;

                // Initialize individual checkbox variables
                checkboxComp.options?.forEach((opt: CheckboxOption) => {
                    if (variableValues[opt.variableName] === undefined) {
                        updateVariable(opt.variableName, opt.defaultValue ?? 0);
                    }
                });

                // Initialize aggregated variable for normal mode
                if (checkboxComp.mode === 'normal' && checkboxComp.aggregatedVariableName) {
                    if (variableValues[checkboxComp.aggregatedVariableName] === undefined) {
                        const sum = checkboxComp.options?.reduce((acc: number, opt: CheckboxOption) => {
                            return acc + (variableValues[opt.variableName] ?? opt.defaultValue ?? 0);
                        }, 0) ?? 0;
                        updateVariable(checkboxComp.aggregatedVariableName, sum);
                    }
                }
            }
        });
    }, []); // Run only once on mount
};
