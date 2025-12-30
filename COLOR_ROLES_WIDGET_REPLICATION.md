# Color Roles Widget Replication Guide

This document outlines the changes made to the main Variablex application to implement customizable color roles. Follow these steps to replicate the same functionality in the widget.

## Overview

The color system uses 6 color roles:
- **primary**: Interactive elements (sliders, checkboxes, selections, focus rings)
- **content**: Text (labels, body text, section headers)
- **neutral**: Borders (inputs, rows, dividers, unfilled tracks)
- **contrast**: Text on primary (checkmarks, selected button text)
- **background**: Section card backgrounds
- **rowBackground**: Row container backgrounds, input fields

---

## Files to Create

### 1. `src/types/colorTheme.types.ts`

Create a new types file for color theme:

```typescript
export interface ColorTheme {
  primary: string;
  content: string;
  neutral: string;
  contrast: string;
  background: string;
  rowBackground: string;
}

export const defaultColorTheme: ColorTheme = {
  primary: '#df6060ff',   // Interactive elements: sliders, checkboxes, selections, focus rings
  content: '#e2e8f0',     // Text: labels, body text, section headers
  neutral: '#475569',     // Borders: inputs, rows, dividers, unfilled tracks
  contrast: '#0f172a',    // Text on primary: checkmarks, selected button text
  background: '#1e293b',  // Section card backgrounds
  rowBackground: '#334155', // Row container backgrounds, input fields
};

export const isValidColorTheme = (obj: unknown): obj is ColorTheme => {
  if (typeof obj !== 'object' || obj === null) return false;
  const theme = obj as Record<string, unknown>;
  return (
    typeof theme.primary === 'string' &&
    typeof theme.content === 'string' &&
    typeof theme.neutral === 'string' &&
    typeof theme.contrast === 'string' &&
    typeof theme.background === 'string' &&
    typeof theme.rowBackground === 'string'
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

### 3. Schema Loading (Main Widget Component)

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

### 4. Section Components

#### InputSection / ResultSection Cards

Apply `theme.background` for section card backgrounds and `theme.neutral` for borders:

```tsx
import { useColorTheme } from '../context/ColorThemeContext';

const InputSection = ({ section }) => {
  const theme = useColorTheme();
  
  return (
    <div
      className="rounded-lg p-4 shadow-sm"
      style={{ 
        backgroundColor: theme.background,
        border: `1px solid ${theme.neutral}`
      }}
    >
      {/* Section header */}
      <h3 
        className="text-sm font-semibold uppercase tracking-wider mb-4"
        style={{ color: theme.content }}
      >
        {section.name}
      </h3>
      
      {/* Row containers */}
      {section.rows.map((row) => (
        <div
          key={row.id}
          className="rounded p-3"
          style={{ 
            backgroundColor: theme.rowBackground,
            border: `1px dashed ${theme.neutral}`
          }}
        >
          {/* Row content */}
        </div>
      ))}
    </div>
  );
};
```

---

### 5. Input Components

All components should use `useColorTheme()` for colors:

#### NumberInput

```tsx
const NumberInput = ({ ... }) => {
  const theme = useColorTheme();
  
  return (
    <div>
      <label style={{ color: theme.content }}>{label}</label>
      <input
        className="w-full px-3 py-2 rounded-md"
        style={{
          color: theme.content,
          border: `1px solid ${theme.neutral}`,
          backgroundColor: theme.rowBackground,
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.outline = `2px solid ${theme.primary}`;
          e.target.style.outlineOffset = '1px';
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none';
        }}
      />
    </div>
  );
};
```

#### Slider

```tsx
const Slider = ({ ... }) => {
  const theme = useColorTheme();
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div>
      <label style={{ color: theme.content }}>{label}</label>
      <input
        type="range"
        style={{
          background: `linear-gradient(to right, 
            ${theme.primary} 0%, 
            ${theme.primary} ${percentage}%, 
            ${theme.neutral} ${percentage}%, 
            ${theme.neutral} 100%)`
        }}
      />
      {/* Value display */}
      <div style={{ 
        backgroundColor: theme.primary, 
        color: theme.contrast 
      }}>
        {value}
      </div>
    </div>
  );
};
```

#### CheckboxInput

```tsx
const CheckboxInput = ({ ... }) => {
  const theme = useColorTheme();
  
  return (
    <div>
      <label style={{ color: theme.content }}>{label}</label>
      {options.map((option) => (
        <div key={option.id}>
          <input
            type="checkbox"
            style={{
              border: `1px solid ${theme.primary}`,
              backgroundColor: isChecked ? theme.primary : theme.rowBackground,
            }}
          />
          {/* Checkmark uses theme.contrast */}
          <span style={{ color: theme.content }}>{option.label}</span>
        </div>
      ))}
    </div>
  );
};
```

#### RadioInput

```tsx
const RadioInput = ({ ... }) => {
  const theme = useColorTheme();
  
  return (
    <div>
      <label style={{ color: theme.content }}>{label}</label>
      {options.map((option) => (
        <div
          key={option.id}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
          style={{
            border: `2px solid ${isSelected ? theme.primary : theme.neutral}`,
            backgroundColor: isSelected ? `${theme.primary}10` : theme.rowBackground,
          }}
        >
          {/* Radio dot uses theme.primary when selected */}
          <span style={{ color: theme.content }}>{option.label}</span>
        </div>
      ))}
    </div>
  );
};
```

#### DropdownInput

```tsx
const DropdownInput = ({ ... }) => {
  const theme = useColorTheme();
  
  return (
    <div>
      <label style={{ color: theme.content }}>{label}</label>
      <button
        className="w-full px-4 py-2.5 rounded-lg"
        style={{
          color: theme.content,
          border: `2px solid ${theme.neutral}`,
          backgroundColor: theme.rowBackground,
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = `2px solid ${theme.primary}`;
          e.currentTarget.style.outlineOffset = '1px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        {selectedOption?.label || 'Select an option'}
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div style={{
          backgroundColor: theme.rowBackground,
          border: `2px solid ${theme.neutral}`,
        }}>
          {options.map((option) => (
            <div
              key={option.id}
              style={{
                color: theme.content,
                backgroundColor: isSelected ? `${theme.primary}20` : 'transparent',
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### TextBlockInput

```tsx
const TextBlockInput = ({ ... }) => {
  const theme = useColorTheme();
  
  return (
    <div>
      <label style={{ color: theme.content }}>{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            className="px-4 py-3 rounded text-sm font-medium"
            style={{
              border: `2px solid ${isSelected ? theme.primary : theme.neutral}`,
              backgroundColor: isSelected ? theme.primary : theme.rowBackground,
              color: isSelected ? theme.contrast : theme.content,
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

---

### 6. Result Components

#### RegularResult / ConditionalResult

```tsx
const RegularResult = ({ ... }) => {
  const theme = useColorTheme();
  
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold"
        style={{ color: theme.content }}
      >
        {label}
      </label>
      <div style={{ color: theme.content }}>
        {parsedContent}
      </div>
    </div>
  );
};
```

---

### 7. Text Display Component

```tsx
const TextDisplay = ({ ... }) => {
  const theme = useColorTheme();
  
  return (
    <div>
      <label style={{ color: theme.content }}>{label}</label>
      <p style={{ color: theme.content }}>{paragraph}</p>
    </div>
  );
};
```

---

## Key Patterns

### Import Pattern

```tsx
import { useColorTheme } from '../context/ColorThemeContext';

const Component = () => {
  const theme = useColorTheme();
  // Use: theme.primary, theme.content, theme.neutral, 
  //      theme.contrast, theme.background, theme.rowBackground
};
```

### Replace Tailwind Color Classes with Inline Styles

```tsx
// ❌ Before (Tailwind - DON'T USE)
className="border-border text-foreground bg-muted"

// ✅ After (Inline - USE THIS)
style={{ 
  borderColor: theme.neutral, 
  color: theme.content, 
  backgroundColor: theme.rowBackground 
}}
```

### Focus Ring Pattern

```tsx
// Remove Tailwind focus classes, use inline handlers instead
onFocus={(e) => {
  e.target.style.outline = `2px solid ${theme.primary}`;
  e.target.style.outlineOffset = '1px';
}}
onBlur={(e) => {
  e.target.style.outline = 'none';
}}
```

### Dynamic CSS for Slider Thumbs

Generate unique class names per slider instance:

```tsx
const sliderClass = `slider-${id}`;

<style>{`
  .${sliderClass}::-webkit-slider-thumb {
    background: ${theme.primary};
    border: 2px solid ${theme.contrast};
  }
`}</style>
```

---

## Classes to AVOID in Preview Components

These Tailwind color classes should NOT be used in preview/widget components:

- `text-foreground`, `text-muted-foreground`, `text-muted`
- `bg-card`, `bg-muted`, `bg-background`, `bg-primary`
- `border-border`, `border-primary`
- `focus:ring-*` (use inline focus handlers instead)
- Any hardcoded color: `text-gray-*`, `bg-slate-*`, etc.

---

## Testing Checklist

After implementation, verify:

- [ ] Section cards use `theme.background`
- [ ] Row containers use `theme.rowBackground`
- [ ] Section headers use `theme.content`
- [ ] All labels use `theme.content`
- [ ] All borders use `theme.neutral`
- [ ] Slider track fills with `theme.primary`
- [ ] Slider thumb uses `theme.primary` with `theme.contrast` border
- [ ] Slider value display uses `theme.primary` bg with `theme.contrast` text
- [ ] Checkbox checked state uses `theme.primary`, checkmark uses `theme.contrast`
- [ ] Checkbox unchecked uses `theme.rowBackground`
- [ ] Radio selected border/dot uses `theme.primary`
- [ ] Radio unselected uses `theme.rowBackground`
- [ ] Dropdown uses `theme.neutral` borders, `theme.rowBackground` background
- [ ] TextBlock selected buttons use `theme.primary`/`theme.contrast`
- [ ] TextBlock unselected buttons use `theme.rowBackground`
- [ ] Focus rings on inputs use `theme.primary`
- [ ] Result content text uses `theme.content`
- [ ] No hardcoded Tailwind colors remain in preview components
