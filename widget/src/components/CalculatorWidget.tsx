import { useState, useCallback, useEffect } from 'preact/hooks';
import { CalculatorSchema } from '../types/schema.types';
import { ComponentRenderer } from './renderers/ComponentRenderer';
import { InputSection } from './sections/InputSection';
import { ResultSection } from './sections/ResultSection';
import { EmptyState } from './sections/EmptyState';
import { useFormulaEvaluation } from '../hooks/useFormulaEvaluation';
import { useConditionalLogic } from '../hooks/useConditionalLogic';
import { useComponentInitialization } from '../hooks/useComponentInitialization';
import { parseResultContent } from '../utils/contentParser';
import { VariableValues } from '../utils/formulaHelpers';

interface CalculatorWidgetProps {
    schema?: CalculatorSchema;
    userId?: string;
    configurationId?: string;
    apiBaseUrl?: string;
    responsiveMode?: boolean;
}

/**
 * Main Calculator Widget Component
 * Renders a calculator based on a schema configuration.
 */
export function CalculatorWidget({
    schema,
    userId,
    configurationId,
    apiBaseUrl = 'http://localhost:8080',
    responsiveMode = false
}: CalculatorWidgetProps) {
    const [variableValues, setVariableValues] = useState<VariableValues>({});
    const [loadedSchema, setLoadedSchema] = useState<CalculatorSchema | null>(schema || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update variable value
    const updateVariable = useCallback((name: string, value: number) => {
        setVariableValues(prev => ({ ...prev, [name]: value }));
    }, []);

    // Load schema from API if userId and configurationId are provided
    useEffect(() => {
        if (!schema && userId && configurationId) {
            const fetchSchema = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(
                        `${apiBaseUrl}/api/v1/embed/${configurationId}`
                    );

                    if (!response.ok) {
                        throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();
                    console.log('Fetched schema data:', data);

                    // The API returns schema as a JSON string in the 'schema' property
                    // We need to parse it to get the actual schema object
                    const parsedSchema = typeof data.schema === 'string'
                        ? JSON.parse(data.schema)
                        : data;

                    console.log('Parsed schema:', parsedSchema);
                    console.log('Schema layout:', parsedSchema?.layout);
                    console.log('Schema components:', parsedSchema?.components);
                    setLoadedSchema(parsedSchema);
                } catch (err) {
                    console.error('Error fetching calculator schema:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load calculator');
                } finally {
                    setLoading(false);
                }
            };

            fetchSchema();
        }
    }, [schema, userId, configurationId, apiBaseUrl]);

    const layout = loadedSchema?.layout || [];
    const components = loadedSchema?.components || [];
    const formulas = loadedSchema?.formulas || [];

    console.log('Current loadedSchema:', loadedSchema);
    console.log('Layout length:', layout.length);
    console.log('Components length:', components.length);

    // Initialize component values on mount
    useComponentInitialization(components, variableValues, updateVariable);

    // Formula evaluation hook
    const { evaluateFormula } = useFormulaEvaluation(variableValues, formulas);

    // Conditional logic hook
    const { evaluateConditionalLine } = useConditionalLogic(
        variableValues,
        formulas,
        evaluateFormula
    );

    // Content parser with dependencies
    const parseContent = (content: string) =>
        parseResultContent(content, variableValues, formulas, evaluateFormula);

    // Component renderer
    const renderComponent = (comp: any) => (
        <ComponentRenderer
            component={comp}
            variableValues={variableValues}
            updateVariable={updateVariable}
            parseResultContent={parseContent}
            evaluateConditionalLine={evaluateConditionalLine}
        />
    );

    // Loading state
    if (loading) {
        return (
            <div className="h-full overflow-y-auto bg-background">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center text-muted-foreground py-12">
                        <p>Loading calculator...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-full overflow-y-auto bg-background">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center text-destructive py-12">
                        <p className="font-semibold mb-2">Error loading calculator</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-transparent">
            <div className="max-w-4xl mx-auto p-8 space-y-6">
                {layout.map((section: any) => {
                    if (section.type === 'input') {
                        return (
                            <InputSection
                                key={section.id}
                                section={section}
                                components={components}
                                renderComponent={renderComponent}
                                responsiveMode={responsiveMode}
                            />
                        );
                    }

                    if (section.type === 'result') {
                        return (
                            <ResultSection
                                key={section.id}
                                section={section}
                                parseResultContent={parseContent}
                                evaluateConditionalLine={evaluateConditionalLine}
                            />
                        );
                    }

                    return null;
                })}

                {layout.length === 0 && <EmptyState />}
            </div>
        </div>
    );
}
