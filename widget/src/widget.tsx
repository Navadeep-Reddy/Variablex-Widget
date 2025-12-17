import { render } from 'preact';
import { CalculatorWidget } from './components/CalculatorWidget';
import './style.css';

// Export for module usage
export { CalculatorWidget };

// Auto-initialize from DOM attributes
if (typeof window !== 'undefined') {
    const containers = document.querySelectorAll('[data-variablex-widget]');
    containers.forEach(container => {
        const userId = container.getAttribute('data-user-id');
        const configurationId = container.getAttribute('data-configuration-id');
        const apiBaseUrl = container.getAttribute('data-api-base-url');
        const schemaJson = container.getAttribute('data-schema');

        const schema = schemaJson ? JSON.parse(schemaJson) : undefined;

        render(
            <CalculatorWidget
                schema={schema}
                userId={userId || undefined}
                configurationId={configurationId || undefined}
                apiBaseUrl={apiBaseUrl || undefined}
            />,
            container
        );
    });
}
