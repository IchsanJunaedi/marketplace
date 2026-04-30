---
name: Corporate Storefront Logic
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3e4a39'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7b67'
  outline-variant: '#bccbb4'
  surface-tint: '#006e08'
  primary: '#006e08'
  on-primary: '#ffffff'
  primary-container: '#00aa13'
  on-primary-container: '#003402'
  inverse-primary: '#56e24b'
  secondary: '#0058bc'
  on-secondary: '#ffffff'
  secondary-container: '#0070eb'
  on-secondary-container: '#fefcff'
  tertiary: '#b80963'
  on-tertiary: '#ffffff'
  tertiary-container: '#fe4e97'
  on-tertiary-container: '#5b002d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#76ff66'
  primary-fixed-dim: '#56e24b'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#005304'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#ffd9e2'
  tertiary-fixed-dim: '#ffb1c8'
  on-tertiary-fixed: '#3e001d'
  on-tertiary-fixed-variant: '#8e004a'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1280px
  gutter: 16px
---

## Brand & Style

The design system is engineered for maximum utility and perceived reliability. It targets a broad demographic where clarity and efficiency are paramount, mimicking the "utility-first" aesthetics of global platforms like Facebook and Gojek. 

The visual style is **Corporate / Modern**. It avoids decorative flourishes, gradients, and emojis in favor of a structural, information-dense layout. The goal is to evoke a sense of stability and institutional trust through rhythmic alignment, high-contrast action states, and a restrained color palette. Every element exists to facilitate a transaction or convey information, with zero tolerance for visual ambiguity.

## Colors

The palette is anchored by a high-visibility primary green, chosen for its association with "go" actions and growth, complemented by a secondary corporate blue for informational depth. 

The color system is strictly functional:
- **Primary (#00AA13):** Reserved for the most important "Success" actions and key brand touchpoints.
- **Secondary (#1877F2):** Used for links, secondary actions, and trusted interface elements.
- **Neutral / Surface:** The background uses a very light gray to allow white cards to pop. Borders are strictly defined at #E5E7EB to provide subtle containment without adding visual weight.
- **High Contrast:** Interactive elements must maintain a minimum 7:1 contrast ratio against their backgrounds to ensure accessibility and professional rigor.

## Typography

This design system utilizes **Inter** exclusively to leverage its systematic, utilitarian nature. The scale is built on a modular progression to ensure a clear hierarchy of information.

Headlines use tighter letter-spacing and heavier weights to anchor sections, while body text is optimized for readability with generous line heights. Labels are strictly defined for functional UI elements like buttons and tags, using semi-bold weights to distinguish them from editorial content. No decorative fonts or italics are permitted in standard storefront flows.

## Layout & Spacing

The system operates on a **strict 8-point grid**. All dimensions, padding, and margins must be multiples of 8px (with 4px reserved for micro-adjustments in tight icons or labels).

The layout follows a **Fixed Grid** model for desktop storefronts, centering content within a 1280px container to maintain focus. Mobile layouts transition to a fluid 2-column or 1-column grid with 16px side margins. Horizontal rhythm is maintained through consistent 16px or 24px gutters, ensuring that even dense product listings feel organized and systematic.

## Elevation & Depth

This design system rejects the use of drop shadows and traditional elevation metaphors. Instead, it utilizes **Low-contrast outlines** and **Tonal layers** to establish hierarchy.

Depth is communicated through:
1.  **Layering:** The base canvas is #F3F4F6. All primary content containers (Cards) are solid white (#FFFFFF).
2.  **Stroke:** Containers are defined by a 1px solid border in #E5E7EB. 
3.  **Active States:** Interactive depth is signaled by slight background color shifts (e.g., a button moving from #00AA13 to a slightly darker shade on hover) rather than a change in shadow or "lift."

## Shapes

The shape language is **Soft (Level 1)**. This provides a professional balance—sharp enough to feel disciplined and corporate, but with enough corner softening (4px-12px) to feel modern and accessible.

- **Standard Elements (Buttons, Inputs):** 4px (0.25rem) radius.
- **Containers (Cards, Modals):** 8px (0.5rem) radius.
- **Large Sections:** 12px (0.75rem) radius.

## Components

### Buttons
Buttons are high-contrast blocks. Primary buttons use the brand green with white text. Secondary buttons use white backgrounds with a 1px gray border and secondary blue or neutral gray text. There are no rounded-pill buttons; only soft-rectangular shapes.

### Cards
Cards are the primary organizational unit. They must be solid white with a 1px border (#E5E7EB). Padding inside cards should follow the 16px or 24px spacing rule. No shadows are allowed; depth is purely a result of the white-on-gray contrast.

### Input Fields
Inputs use a white background, 1px border (#E5E7EB), and 4px border radius. Focused states must use a 2px solid border in the secondary blue (#1877F2) to provide clear visual feedback. Labels sit above the field in `label-md` style.

### Lists & Tables
Data-heavy views use subtle horizontal dividers (#E5E7EB) instead of zebra-striping. This maintains the clean, "Facebook-style" feed aesthetic.

### Chips & Badges
Used for categories or status. These use a light gray background with bold, condensed text. They do not have borders, keeping them visually distinct from buttons and cards.