import { render } from 'preact';
import { CalculatorWidget } from './components/CalculatorWidget';
import styles from './style.css?inline';

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
        container.className = 'variablex-widget-container';
        currentScript.parentNode?.insertBefore(container, currentScript.nextSibling);

        // Create Shadow DOM for style isolation
        const shadowRoot = container.attachShadow({ mode: 'open' });

        // Inject styles into the shadow DOM (not the document head)
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        shadowRoot.appendChild(styleSheet);

        // Create a wrapper div inside shadow DOM for rendering
        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = 'variablex-widget-root';
        shadowRoot.appendChild(widgetWrapper);

        render(
            <CalculatorWidget
                schema={schema}
                configurationId={configurationId || undefined}
                apiBaseUrl={apiBaseUrl || undefined}
            />,
            widgetWrapper
        );
    }
}

