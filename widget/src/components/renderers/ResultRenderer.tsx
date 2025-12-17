import { ConditionalBlock } from '../../hooks/useConditionalLogic';
import { ResultStyle } from '../../utils/styleHelpers';

interface RegularResultProps {
    id: string;
    content: string;
    style: ResultStyle;
    parsedContent: string;
    styleClass: string;
    fontSize?: string;
    textAlign?: string;
}

interface ConditionalResultProps {
    id: string;
    blocks: ConditionalBlock[];
    parseResultContent: (content: string) => string;
    evaluateConditionalLine: (line: { blocks: ConditionalBlock[] }, parseResultContent: (content: string) => string) => { message: string; style: ResultStyle } | null;
    getResultStyleClass: (style: ResultStyle) => string;
    fontSize?: string;
    textAlign?: string;
}

/**
 * Renders a regular result component with parsed content.
 */
export const RegularResult = ({
    id,
    parsedContent,
    styleClass,
    fontSize = 'medium',
    textAlign = 'left'
}: RegularResultProps) => {
    const fontSizeClass = {
        'small': 'text-sm',
        'medium': 'text-base',
        'large': 'text-lg',
        'xlarge': 'text-xl'
    }[fontSize] || 'text-base';

    const textAlignClass = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    }[textAlign] || 'text-left';

    return (
        <div key={id} className={`p-4 border-2 rounded ${styleClass} ${fontSizeClass} ${textAlignClass}`}>
            {parsedContent}
        </div>
    );
};

/**
 * Renders a conditional result component by evaluating blocks.
 */
export const ConditionalResult = ({
    id,
    blocks,
    parseResultContent,
    evaluateConditionalLine,
    getResultStyleClass,
    fontSize = 'medium',
    textAlign = 'left'
}: ConditionalResultProps) => {
    let displayedBlock: ConditionalBlock | null = null;

    for (const block of blocks) {
        if (block.type === 'else') {
            displayedBlock = block;
            break;
        }

        const result = evaluateConditionalLine({ blocks: [block] }, parseResultContent);
        if (result) {
            displayedBlock = block;
            break;
        }
    }

    if (!displayedBlock) return null;

    const parsedMessage = parseResultContent(displayedBlock.message || '');
    const styleClass = getResultStyleClass(displayedBlock.style || 'default');

    const fontSizeClass = {
        'small': 'text-sm',
        'medium': 'text-base',
        'large': 'text-lg',
        'xlarge': 'text-xl'
    }[fontSize] || 'text-base';

    const textAlignClass = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    }[textAlign] || 'text-left';

    return (
        <div key={id} className={`p-4 border-2 rounded ${styleClass} ${fontSizeClass} ${textAlignClass}`}>
            {parsedMessage}
        </div>
    );
};
