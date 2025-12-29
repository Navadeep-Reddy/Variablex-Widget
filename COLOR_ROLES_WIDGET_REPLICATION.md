# Color Roles Widget Replication Guide

This document outlines the changes made to the main Variablex application to implement customizable color roles. Follow these steps to replicate the same functionality in the widget.

## Overview

The color system uses 4 color roles:
- **primary**: Brand color for interactive elements (slider fills, checkbox/radio checked states)
- **content**: Text color for labels and body text  
- **neutral**: Border color for inputs and unfilled slider tracks
- **contrast**: Color for text/icons on primary-colored elements (checkmarks)

## Files to Create

### 1. `src/types/colorTheme.types.ts`

Create a new types file for color theme:

```typescript
export interface ColorTheme {
  primary: string;
  content: string;
  neutral: string;
  contrast: string;
}

export const defaultColorTheme: ColorTheme = {
  primary: '#000000',
  content: '#1f2937',
  neutral: '#d1d5db',
  contrast: '#ffffff',
};

export const isValidColorTheme = (obj: unknown): obj is ColorTheme => {
  if (typeof obj !== 'object' || obj === null) return false;
  const theme = obj as Record<string, unknown>;
  return (
    typeof theme.primary === 'string' &&
    typeof theme.content === 'string' &&
    typeof theme.neutral === 'string' &&
    typeof theme.contrast === 'string'
  );
};

export const mergeWithDefaults = (partial: Partial<ColorTheme>): ColorTheme => ({
  ...defaultColorTheme,
  ...partial,
});
```

### 2. `src/context/ColorThemeContext.tsx`

Create a React Context for color theme:

```typescript
import React, { createContext, useContext } from 'react';
import { ColorTheme, defaultColorTheme } from '../types/colorTheme.types';

export const ColorThemeContext = createContext<ColorTheme>(defaultColorTheme);

export const useColorTheme = (): ColorTheme => {
  return useContext(ColorThemeContext);
};

interface ColorThemeProviderProps {
  theme: ColorTheme;
  children: React.ReactNode;
}

export const ColorThemeProvider: React.FC<ColorThemeProviderProps> = ({ 
  theme, 
  children 
}) => {
  return (
    <ColorThemeContext.Provider value={theme}>
      {children}
    </ColorThemeContext.Provider>
  );
};
```

---

## Files to Modify

### 3. Schema Loading (`CalculatorWidget.tsx` or main component)

When fetching/parsing schema data, extract `colorTheme`:

```typescript
import { ColorTheme, defaultColorTheme, isValidColorTheme } from '../types/colorTheme.types';

// When parsing schema
const colorTheme: ColorTheme = isValidColorTheme(schema.colorTheme) 
  ? schema.colorTheme 
  : defaultColorTheme;
```

Wrap the widget content with the provider:

```tsx
<ColorThemeProvider theme={colorTheme}>
  {/* Widget content */}
</ColorThemeProvider>
```

---

### 4. Input Components

Update components to use `useColorTheme()` instead of hardcoded colors:

#### SliderRenderer / InputComponents

```tsx
import { useColorTheme } from '../context/ColorThemeContext';

const SliderRenderer = ({ ... }) => {
  const theme = useColorTheme();
  
  // Use theme.primary for fill color
  // Use theme.neutral for unfilled track
  // Use theme.contrast for thumb border
  
  style={{
    background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${percentage}%, ${theme.neutral} ${percentage}%, ${theme.neutral} 100%)`
  }}
}
```

#### CheckboxInput

```tsx
// Replace border-black with theme.primary
// Replace bg-black (checked) with theme.primary  
// Replace white checkmark with theme.contrast

style={{
  border: `1px solid ${theme.primary}`,
  backgroundColor: isChecked ? theme.primary : 'white',
}}
```

#### RadioInput

```tsx
// Selected border: theme.primary
// Unselected border: theme.neutral
// Inner dot: theme.primary

style={{
  border: `2px solid ${isSelected ? theme.primary : theme.neutral}`,
}}
```

#### DropdownInput

```tsx
// Border: theme.neutral
// Text: theme.content
// Selected option background: theme.neutral

style={{
  color: theme.content,
  border: `2px solid ${theme.neutral}`,
}}
```

#### TextBlockInput

```tsx
// Selected button: bg=theme.primary, text=theme.contrast
// Unselected button: border=theme.neutral, text=theme.content

style={{
  border: `2px solid ${isSelected ? theme.primary : theme.neutral}`,
  backgroundColor: isSelected ? theme.primary : 'transparent',
  color: isSelected ? theme.contrast : theme.content,
}}
```

---

### 5. Labels and Text

Replace all `text-foreground` classes with inline styles:

```tsx
// Before
<label className="text-foreground">Label</label>

// After
<label style={{ color: theme.content }}>Label</label>
```

---

### 6. Result Components

Update result labels to use theme.content:

```tsx
<label style={{ color: theme.content }}>
  {label}
</label>
```

---

## Key Patterns

### Import Pattern
```tsx
import { useColorTheme } from '../context/ColorThemeContext';

const Component = () => {
  const theme = useColorTheme();
  // Use theme.primary, theme.content, theme.neutral, theme.contrast
};
```

### Style Pattern (Replace Tailwind with Inline)
```tsx
// Before (Tailwind)
className="border-border text-foreground"

// After (Inline)
style={{ borderColor: theme.neutral, color: theme.content }}
```

### Dynamic CSS for Slider Thumbs
Generate unique class names per slider instance to avoid conflicts:
```tsx
const sliderClass = `slider-${id}`;
// Then use <style> tag with dynamic colors
```

---

## Testing Checklist

After implementation, verify:
- [ ] Slider track fills with primary color
- [ ] Slider thumb uses primary color with contrast border
- [ ] Checkbox checked state uses primary/contrast colors
- [ ] Radio selected dot uses primary color
- [ ] Dropdown borders use neutral color
- [ ] All labels use content color
- [ ] TextBlock selected buttons use primary/contrast
- [ ] Default colors match current black/white theme
