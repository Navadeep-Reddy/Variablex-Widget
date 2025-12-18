import { ComponentData } from '../renderers/ComponentRenderer';

interface Column {
    id: string;
    components: string[];
}

interface Row {
    id: string;
    columns: Column[];
}

interface InputSectionData {
    id: string;
    type: 'input';
    name: string;
    rows: Row[];
}

interface InputSectionProps {
    section: InputSectionData;
    components: ComponentData[];
    renderComponent: (comp: ComponentData | undefined) => any;
    responsiveMode?: boolean;
}

/**
 * Renders an input section with grid layout for rows and columns.
 */
export const InputSection = ({
    section,
    components,
    renderComponent,
    responsiveMode = false
}: InputSectionProps) => {
    return (
        <div key={section.id} className="border border-border rounded-lg p-4 bg-card shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b border-border">
                {section.name}
            </h3>
            <div className="space-y-4">
                {section.rows.map((row) => (
                    <div key={row.id} className="border border-dashed border-border rounded p-3 bg-muted/20">
                        <div
                            className="grid gap-4 md:grid-cols-1"
                            style={row.columns.length > 1 ? {
                                gridTemplateColumns: `repeat(${row.columns.length}, 1fr)`
                            } : undefined}
                        >
                            {row.columns.map((column) => (
                                <div key={column.id} className="space-y-3">
                                    {column.components
                                        .map(componentId => components.find(c => c.id === componentId))
                                        .filter((comp): comp is ComponentData => comp !== undefined)
                                        .map(comp => (
                                            <div key={comp.id}>
                                                {renderComponent(comp)}
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
