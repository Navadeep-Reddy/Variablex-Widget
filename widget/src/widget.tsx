import { render } from 'preact';
import { CalculatorWidget } from './components/CalculatorWidget';
import './style.css';

// Export for module usage
export { CalculatorWidget };

// Auto-initialize from script tag attributes
if (typeof window !== 'undefined') {
    // Get the current script tag
    const currentScript = document.currentScript as HTMLScriptElement;

    if (currentScript) {
        const configurationId = currentScript.getAttribute('data-configuration-id');
        const apiBaseUrl = currentScript.getAttribute('data-api-base-url');
        const schemaJson = currentScript.getAttribute('data-schema');

        const schema = schemaJson ? JSON.parse(schemaJson) : undefined;

        // Create a container div and insert it after the script tag
        const container = document.createElement('div');
        currentScript.parentNode?.insertBefore(container, currentScript.nextSibling);

        render(
            <CalculatorWidget
                schema={schema}
                configurationId={configurationId || undefined}
                apiBaseUrl={apiBaseUrl || undefined}
            />,
            container
        );
    }
}
