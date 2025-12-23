# Widget Implementation Instructions

> **Purpose**: This document tracks changes made to the preview/rendering components in the main Variablex application that need to be implemented in the Preact widget.

---

## 📋 Pending Changes

### [Date: 2025-12-23] - Row-by-Row Component Alignment Across Columns

**Main App Files Modified:**
- `client/src/components/builder/preview/components/InputSection.tsx`

**Widget Files to Update:**
- `widget/src/components/sections/InputSection.tsx`

**Description:**
Changed the rendering approach from column-by-column to row-by-row. Previously, components in column 1 were rendered, then column 2, etc. This caused misalignment when columns had components of different heights. Now, components at the same index position across all columns are rendered together in the same grid row, ensuring perfect horizontal alignment.

**Implementation Steps:**
1. Open `widget/src/components/sections/InputSection.tsx`
2. Find the section that renders rows and columns
3. Replace the column-by-column rendering with row-by-row rendering

**Code Change:**
```tsx
// BEFORE - Column by column (causes misalignment):
{row.columns.map((column) => (
    <div key={column.id} className="space-y-3 self-start">
        {column.components.map(componentId => 
            renderComponent(components.find(c => c.id === componentId))
        )}
    </div>
))}

// AFTER - Row by row (components align horizontally):
{(() => {
    const maxComponents = Math.max(...row.columns.map(col => col.components.length));
    return Array.from({ length: maxComponents }, (_, componentIndex) => (
        <div
            key={componentIndex}
            className={responsiveMode ? "flex flex-col gap-4" : "grid gap-4 items-start"}
            style={responsiveMode ? {} : { gridTemplateColumns: `repeat(${row.columns.length}, 1fr)` }}
        >
            {row.columns.map((column) => {
                const componentId = column.components[componentIndex];
                const comp = componentId 
                    ? components.find(c => c.id === componentId)
                    : undefined;
                return (
                    <div key={column.id} className={responsiveMode ? 'w-full' : ''}>
                        {comp ? renderComponent(comp) : <div className="min-h-0" />}
                    </div>
                );
            })}
        </div>
    ));
})()}
```

**Notes:**
- Components at the same index position across columns now align horizontally
- Empty placeholder rendered if column has fewer components than others
- Critical for visual consistency when text components push other components down

---

### [Date: 2025-12-23] - Responsive Mode Full-Width Components

**Main App Files Modified:**
- `client/src/components/builder/preview/components/InputSection.tsx`
- `client/src/components/layout/RowBlock.jsx`
- `client/src/components/layout/ColumnBlock.jsx`

**Widget Files to Update:**
- `widget/src/components/sections/InputSection.tsx`

**Description:**
In mobile/responsive mode, columns now stack vertically AND take up full width of the container. Previously, columns stacked but retained narrow widths.

**Implementation Steps:**
1. In `InputSection.tsx`: Add `w-full` class to column wrapper when `responsiveMode` is true
2. In `RowBlock.jsx`: Pass `responsiveMode` prop to `ColumnBlock`
3. In `ColumnBlock.jsx`: Accept `responsiveMode` prop and add `w-full` class

**Code Change:**
```tsx
// In InputSection.tsx - column wrapper:
<div key={column.id} className={responsiveMode ? 'w-full' : ''}>

// In RowBlock.jsx - pass prop:
<ColumnBlock
    key={column.id}
    section={section}
    row={row}
    column={column}
    isLastColumn={index === row.columns.length - 1}
    responsiveMode={responsiveMode}  // Add this line
/>

// In ColumnBlock.jsx - wrapper div:
<div className={`relative self-start ${responsiveMode ? 'w-full' : ''}`}>
```

**Notes:**
- Affects both preview mode and edit mode
- Components stack vertically and take full container width
- Container max-width remains unchanged (still centered)

---

### [Date: 2025-12-22] - Fix Component Vertical Alignment in Grid Layout

**Main App Files Modified:**
- `client/src/components/builder/preview/components/InputSection.tsx`

**Widget Files to Update:**
- `widget/src/components/sections/InputSection.tsx`

**Description:**
Components in different columns within the same row were not aligned at the top, causing a messy appearance. Fixed by adding `items-start` to the grid container to ensure all components start at the same vertical position regardless of their height.

**Implementation Steps:**
1. Open `widget/src/components/sections/InputSection.tsx`
2. Locate the grid container div (the one with `gridTemplateColumns`)
3. Add `items-start` to the className for the grid layout
4. The grid className should be: `"grid gap-4 items-start"` instead of just `"grid gap-4"`

**Code Change:**
```tsx
// Grid container change:
// Before:
className={responsiveMode ? "flex flex-col gap-4" : "grid gap-4"}
// After:
className={responsiveMode ? "flex flex-col gap-4" : "grid gap-4 items-start"}

// Column container change:
// Before:
<div key={column.id} className="space-y-3">
// After:
<div key={column.id} className="space-y-3 self-start">
```

**Notes:**
- This ensures components align at the top of their grid cells
- Only affects grid layout, not responsive/flex layout
- Critical for visual consistency when components have different heights
- **Additional files modified in main app (builder edit view):**
  - `client/src/components/layout/RowBlock.jsx` - Added `items-start` to grid
  - `client/src/components/layout/ColumnBlock.jsx` - Added `self-start` to column wrapper

---

### [Date: 2025-12-22] - Add Label Display to Result and Text Components

**Main App Files Modified:**
- `client/src/components/builder/preview/renderers/ResultRenderer.tsx`
- `client/src/components/builder/preview/renderers/ComponentRenderer.tsx`

**Widget Files to Update:**
- `widget/src/components/renderers/ResultRenderer.tsx` (or equivalent)
- `widget/src/components/renderers/ComponentRenderer.tsx` (or equivalent)

**Description:**
Added label option display for `resultRegular`, `resultConditional`, and `text` components. When a label is configured in the settings, it now displays above the component content in preview mode.

**Implementation Steps:**
1. Update `ResultRenderer` to accept and display `label` prop:
   - Add `label?: string` to both `RegularResultProps` and `ConditionalResultProps` interfaces
   - Wrap content in `space-y-2` container
   - Add label display: `{label && <label className="block text-sm font-semibold text-foreground">{label}</label>}`
2. Update `ComponentRenderer` to pass `label` prop:
   - Pass `label={comp.label}` to `RegularResult` and `ConditionalResult` components
   - Add label display to the `text` component case

**Code Snippets:**
```tsx
// In ResultRenderer - RegularResult and ConditionalResult
return (
    <div key={id} className="space-y-2">
        {label && (
            <label className="block text-sm font-semibold text-foreground">
                {label}
            </label>
        )}
        <div className={`p-4 border-2 rounded ${styleClass} ${fontSizeClass} ${textAlignClass}`}>
            {content}
        </div>
    </div>
);

// In ComponentRenderer - text case
return (
    <div className="space-y-2">
        {comp.label && (
            <label className="block text-sm font-semibold text-foreground">
                {comp.label}
            </label>
        )}
        <p className={`${fontSizeClass} ${textAlignClass}`}>{comp.text || 'Text Display'}</p>
    </div>
);
```

**Notes:**
- Labels are optional and only display when configured
- Uses consistent styling with other component labels (`font-semibold`)
- Settings already exist in main app (ResultRegularSettings, ResultConditionalSettings, ComponentSettings)

---

### [Date: 2025-12-22] - Fix Vertical Alignment for Text and Result Components

**Main App Files Modified:**
- `client/src/components/builder/preview/renderers/ResultRenderer.tsx`
- `client/src/components/builder/preview/renderers/ComponentRenderer.tsx`

**Widget Files to Update:**
- `widget/src/components/renderers/ResultRenderer.tsx` (or equivalent)
- `widget/src/components/renderers/ComponentRenderer.tsx` (or equivalent)

**Description:**
Fixed vertical alignment issue where text and result components would start at a higher position than input components in the same row. This was because input components always have a label, but text/result components only showed labels when configured.

**Implementation Steps:**
1. **Always render a label element** - Even when no label is configured, render an invisible label placeholder using `{label || '\u00A0'}` (non-breaking space)
2. Apply this change to:
   - `RegularResult` component
   - `ConditionalResult` component
   - `text` case in ComponentRenderer

**Code Snippets:**
```tsx
// Before (conditionally rendered):
{label && (
    <label className={`block text-sm font-semibold text-foreground ${textAlignClass}`}>
        {label}
    </label>
)}

// After (always rendered with fallback):
{/* Always render label placeholder to maintain alignment with input components */}
<label className={`block text-sm font-semibold text-foreground ${textAlignClass}`}>
    {label || '\u00A0'}
</label>
```

**Notes:**
- Uses non-breaking space (`\u00A0`) as invisible placeholder when no label
- Ensures all components in a row start their content boxes at the same vertical position
- Text component also adds a `py-2` wrapper around the text content for consistent spacing

---

## ✅ Completed Changes

### [Date: YYYY-MM-DD] - Example Completed Change

**Status:** ✅ Implemented on YYYY-MM-DD

**Main App Files Modified:**
- `client/src/components/preview/SomeComponent.tsx`

**Widget Files Updated:**
- `widget/src/components/sections/InputSection.tsx`

**Summary:**
Brief summary of what was implemented.

---

## 📝 Template for New Entries

Copy and paste this template when documenting new changes:

```markdown
### [Date: YYYY-MM-DD] - [Change Title]

**Main App Files Modified:**
- `path/to/file`

**Widget Files to Update:**
- `widget/src/path/to/file`

**Description:**
What changed in the main app preview/rendering?

**Implementation Steps:**
1. First step
2. Second step
3. Third step

**Code Snippets (if applicable):**
```language
// Code example from main app
```

**Notes:**
- Important considerations
- Edge cases
- Testing requirements
```

---

## 🗂️ Component Mapping Reference

This section maps main app preview components to their widget equivalents:

| Main App Component | Widget Component | Notes |
|-------------------|------------------|-------|
| `client/src/components/builder/preview/*` | `widget/src/components/*` | Preview rendering logic |
| `client/src/components/layout/*` | `widget/src/components/sections/*` | Layout components |
| `client/src/styles/*` | `widget/src/style.css` | Styling |

---

## 🔧 Common Implementation Patterns

### Pattern 1: Component Rendering Changes
When the main app changes how a component is rendered in preview mode:
1. Locate the equivalent component in `widget/src/components/`
2. Update the rendering logic to match
3. Ensure styles are updated in `widget/src/style.css`
4. Test with `pnpm run dev` in the widget directory

### Pattern 2: Style Updates
When CSS/styling changes in the main app:
1. Identify the affected classes
2. Update `widget/src/style.css` with matching styles
3. Ensure shadow DOM compatibility (no global selectors)
4. Test responsiveness

### Pattern 3: New Component Types
When a new component type is added:
1. Create the component in `widget/src/components/`
2. Add rendering logic to the appropriate section component
3. Update type definitions if needed
4. Add styles to `widget/src/style.css`

---

## 🚀 Testing Checklist

Before marking a change as complete:
- [ ] Widget renders correctly in isolation
- [ ] Styles match the main app preview
- [ ] Shadow DOM doesn't break styling
- [ ] Responsive design works
- [ ] No console errors
- [ ] Tested with sample data

---

## 📚 Additional Resources

- Main App Preview Directory: `/home/navadeep/Documents/Projects/Variablex/client/src/components/builder/preview/`
- Widget Source: `/home/navadeep/Documents/Projects/Variablex-Widget/widget/src/`
- Widget Test Files: `/home/navadeep/Documents/Projects/Variablex-Widget/widget/test/`
