import { ResultStyle } from '../../utils/styleHelpers';
import { ConditionalBlock } from '../../hooks/useConditionalLogic';

interface RegularLine {
    id: string;
    type: 'regular';
    content: string;
}

interface ConditionalLine {
    id: string;
    type: 'conditional';
    blocks: ConditionalBlock[];
}

type ResultLine = RegularLine | ConditionalLine;

interface ResultSectionData {
    id: string;
    type: 'result';
    name: string;
    lines?: ResultLine[];
    content?: string; // Legacy support
}

interface ResultSectionProps {
    section: ResultSectionData;
    parseResultContent: (content: string) => string;
    evaluateConditionalLine: (line: { blocks: ConditionalBlock[] }, parseResultContent: (content: string) => string) => { message: string; style: ResultStyle } | null;
}

const getConditionalStyleClasses = (style: ResultStyle): string => {
    switch (style) {
        case 'success':
            return 'bg-green-100 border-green-300 text-green-800';
        case 'warning':
            return 'bg-yellow-100 border-yellow-300 text-yellow-800';
        case 'error':
            return 'bg-red-100 border-red-300 text-red-800';
        default:
            return 'bg-gray-100 border-gray-300 text-gray-800';
    }
};

/**
 * Renders a result section with regular and conditional lines.
 * Supports legacy content format.
 */
export const ResultSection = ({
    section,
    parseResultContent,
    evaluateConditionalLine
}: ResultSectionProps) => {
    // Support both old content format and new lines format
    const lines = section.lines || (section.content ? [{ id: 'legacy', content: section.content, type: 'regular' as const }] : []);

    return (
        <div key={section.id} className="border-2 border-primary/30 rounded-lg p-4 bg-primary/5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 pb-2 border-b border-primary/20">
                {section.name}
            </h3>
            <div className="space-y-3">
                {lines.map((line) => {
                    const lineType = line.type || 'regular';

                    if (lineType === 'regular') {
                        const regularLine = line as RegularLine;
                        return (
                            <div key={line.id} className="text-base leading-relaxed text-foreground">
                                {parseResultContent(regularLine.content)}
                            </div>
                        );
                    } else if (lineType === 'conditional') {
                        const conditionalLine = line as ConditionalLine;
                        const result = evaluateConditionalLine(conditionalLine, parseResultContent);
                        if (!result || !result.message) return null;

                        return (
                            <div
                                key={line.id}
                                className={`p-3 rounded-lg border-2 ${getConditionalStyleClasses(result.style)}`}
                            >
                                <div className="text-base leading-relaxed">
                                    {result.message}
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
};
