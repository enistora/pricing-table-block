# Pricing Table Block

A responsive WordPress block for creating accessible pricing tables with WCAG 2.1 AA compliance.

## Installation

1. Download the plugin folder and upload to `wp-content/plugins/`
2. Activate "Pricing Table Block" in WordPress Admin > Plugins
3. Block appears in Gutenberg under "Pricing" category

## Usage

1. Add "Pricing Table" block in Gutenberg editor
2. Configure 2-3 tiers using the editor interface or settings panel
3. Edit plan names, prices, descriptions, and feature lists
4. Set call-to-action button text and URLs
5. Mark a tier as "featured" for highlighting
6. Toggle between edit/preview modes using the toolbar

## Assumptions

- **Default Configuration**: Starts with 2 tiers (Basic/Pro plans)
- **Tier Limits**: 2-3 tiers maximum for optimal mobile display
- **Layout Strategy**: CSS Grid with mobile-first responsive design
- **Design Integration**: Uses Twenty Twenty-Five theme design tokens
- **URL Handling**: Client-side sanitization with HTTPS defaults

## Considerations

**Accessibility**: Full WCAG 2.1 AA compliance with semantic HTML, ARIA attributes, keyboard navigation, and screen reader optimization. Color contrast exceeds 4.5:1 ratios.

**Code Structure**: Modern WordPress development with React components, SCSS compilation, and proper asset enqueuing. JSDoc documentation for maintainability.

**Optional Enhancements**: Featured tier system, URL sanitization, shimmer button effects, and comprehensive accessibility testing validate production readiness.

## Testing

Use `test-example.json` to import a sample pricing table with 3 tiers, featured tier highlighting, and various feature configurations for testing purposes.
