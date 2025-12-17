export type ResultStyle = 'default' | 'success' | 'warning' | 'error';

/**
 * Maps result style types to Tailwind CSS classes.
 * Ensures consistent styling across regular and conditional results.
 * 
 * @param style - The style type
 * @returns CSS class string for the given style
 */
export const getResultStyleClass = (style: ResultStyle): string => {
    const styleMap: Record<ResultStyle, string> = {
        default: 'bg-gray-100 text-gray-900 border-gray-300',
        success: 'bg-green-50 text-green-900 border-green-300',
        warning: 'bg-yellow-50 text-yellow-900 border-yellow-300',
        error: 'bg-red-50 text-red-900 border-red-300',
    };

    return styleMap[style] || styleMap.default;
};

/**
 * Gets font size class from size string.
 */
export const getFontSizeClass = (fontSize?: string): string => {
    const sizeMap: Record<string, string> = {
        'small': 'text-sm',
        'medium': 'text-base',
        'large': 'text-lg',
        'xlarge': 'text-xl'
    };
    return sizeMap[fontSize || 'medium'] || 'text-base';
};

/**
 * Gets text alignment class from alignment string.
 */
export const getTextAlignClass = (textAlign?: string): string => {
    const alignMap: Record<string, string> = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    };
    return alignMap[textAlign || 'left'] || 'text-left';
};
