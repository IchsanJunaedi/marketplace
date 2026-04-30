---
name: Enterprise Precision
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#555f6d'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f1'
  on-secondary-container: '#596372'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d9e3f4'
  secondary-fixed-dim: '#bdc7d8'
  on-secondary-fixed: '#121c28'
  on-secondary-fixed-variant: '#3e4755'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  card-gap: 16px
  inline-element-gap: 8px
  table-cell-padding: 12px 16px
---

## Brand & Style

This design system is engineered for high-utility enterprise environments where data density and cognitive clarity are paramount. The brand personality is clinical, reliable, and strictly functional, prioritizing the speed of information retrieval over decorative flair.

The design style follows a **Corporate / Modern** aesthetic, utilizing a disciplined "Surface-on-Base" architecture. It draws inspiration from heavy-duty administrative interfaces, focusing on high-contrast data containers against a neutral foundation. The objective is to evoke a sense of organized control and professional stability for power users who manage complex workflows.

## Colors

The palette is anchored by a neutral gray background (`#F3F4F6`) to reduce eye strain during long-duration usage. Primary actions utilize a dependable "Enterprise Blue" to signify interactive affordance without being distracting. 

- **Primary:** Used for the main "Call to Action" buttons, active states, and progress indicators.
- **Surface:** Pure white is reserved exclusively for data-containing cards and modals to create a crisp "lift" from the gray canvas.
- **Borders:** A consistent light gray is used for structural division, ensuring that even in dense layouts, the visual hierarchy remains distinct.
- **Status:** Standard semantic colors (Green for Success, Red for Error, Amber for Warning) should be used sparingly and only to denote system health or required attention.

## Typography

This design system utilizes **Inter** exclusively for its exceptional legibility in UI contexts and its comprehensive support for tabular numbers. 

The type scale is deliberately compact to support data density. Use `body-sm` as the primary size for table data and descriptions. `label-caps` should be used for secondary headers within cards or for table column headers to provide a clear structural break. Always enable `tnum` (tabular figures) for numeric data in tables and dashboards to ensure vertical alignment of digits.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for the main content area (centered, max-width 1440px) to maintain readability on wide-screen monitors, while the side navigation remains pinned to the left. 

A 4px baseline grid governs all spacing. Vertical rhythm is tight: cards are separated by 16px, and internal card padding is 24px. For data tables, use a 12px vertical padding on rows to maximize the number of visible rows without sacrificing legibility. Information should be grouped logically into cards rather than floating freely on the background.

## Elevation & Depth

Hierarchy in this design system is achieved through **Tonal Layers** and **Low-Contrast Outlines**. 

- **Level 0 (Canvas):** The `#F3F4F6` background serves as the foundation.
- **Level 1 (Cards):** Pure white surfaces with a 1px solid border of `#E5E7EB`. No shadows are used for standard cards to maintain a flat, professional "document" feel.
- **Level 2 (Dropdowns/Modals):** Elements that float above the main UI use a very subtle, diffused ambient shadow (0px 4px 6px rgba(0,0,0,0.05)) and a slightly darker border to separate them from the underlying white cards.

Avoid backdrop blurs or vibrant gradients; depth should feel structural, not decorative.

## Shapes

The shape language is conservative and geometric. A "Soft" (`0.25rem`) corner radius is applied to buttons, input fields, and small UI components. Larger containers like cards use the same radius to maintain a unified, "precision-machined" look. 

Buttons should never be fully rounded (pill-shaped); they must maintain a rectangular profile with soft corners to align with the enterprise aesthetic.

## Components

- **Buttons:** Solid primary blue for main actions. Ghost buttons (border only) for secondary actions to reduce visual noise in data-heavy rows.
- **Data Tables:** The core of the system. Rows should have a subtle hover state (`#F9FAFB`) and no vertical borders between columns. Use a 1px horizontal divider between rows.
- **Input Fields:** White background with a 1px `#D1D5DB` border. Focus states use a 1px blue border and a 2px light blue outer glow.
- **Chips/Badges:** Small, non-rounded rectangles with light background tints and dark text (e.g., light green background with dark green text for "Active" status).
- **Cards:** Crisp white containers with a title bar separated by a subtle 1px divider. Used to group related data visualizations or form sections.
- **Side Navigation:** Dark charcoal background (`#111827`) with high-contrast white or light gray text to clearly separate the navigation logic from the content canvas.