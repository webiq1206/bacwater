# Focused calculator screens and homepage

User-requested design follow-up to main e875279bea9b8939d3f605643925f48d914fd8f9. The approved ivory, sage and forest-green identity is retained.

## Implementation

The homepage opening scene occupies at least the visible viewport below its header. The calculator is named in the H1 and has a prominent launcher. The next content section is below that opening scene, not partially displayed behind it. On short phones, repeated card copy and a decorative arithmetic example yield to the primary action. Essential instructions and limitations remain visible. The homepage uses one compact header rather than two persistent navigation bars.

Calculator routes now use a dedicated viewport-aware page shell. Website navigation, footer, supplier carousel and global privacy panel do not surround active calculations. Native links preserve Back, Forward and deep linking. The shell has its own Back, calculator selection and Help controls, one inner content scroller, safe-area padding and an action dock. Pinch zoom is not disabled or counter-scaled.

The main calculator defaults to one question at a time. All-at-once remains an explicit alternative. Continue, Back and Save use a single workspace action dock. The draft retains valid inputs and its current step. The BAC water tool separates mobile inputs and results with See my result and Edit numbers. Other small converters retain their direct two-way edits and calculations.

Compound reference pages link to dedicated /calculate/{slug} tools instead of embedding active inputs among articles and product listings. These utility URLs are noindex and point their canonical at the existing reference. Existing reference URLs and their public discovery remain unchanged. hCG IU remains distinct from mass and syringe-scale units.

Help opens a separate pane and returns to the same calculation. It contains the existing guide content, necessary limitations, privacy controls and a direct BAC water supplier link. It does not guess a dose, alter product links or select a treatment. Supplier carousels remain on browsing pages; the newer explicit request for no other content during calculation governs workspace placement.

## Verification requirements and limits

The added acceptance script covers viewport fit, no surrounding website chrome, the homepage fold, primary action visibility, focus, draft refresh/Back, help return and BAC water link, shortened screen height, portrait/landscape resizing, enlarged text, first-visit age confirmation, compound utility metadata, and Chromium/WebKit converter persistence. Existing calculation, security, account, publishing, PDF, consent, sitemap and supplier suites remain required. Intentional navigation changes are reflected in their actual interaction paths rather than removing those checks.

Review the final PR's results and screenshots for outcomes. Browser-engine and viewport tests are not a physical iPhone/Android keyboard test, native application certification, screen-reader assessment or clinical review. Scrolling inside a calculation is allowed when content, text scaling or a keyboard leaves less space; no text is clipped or shrunk solely to force every state into one frame.

No schema change, production database operation, dependency upgrade, Replit configuration change, Agent prompt or TinyFish call is part of this release. GitHub merge and Replit publication are separate. Preserve the database-safe publishing configuration and inspect the deployed release after republishing.

## Technical references

Checked during this implementation: MDN VisualViewport (https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport) and CSS viewport-relative lengths (https://developer.mozilla.org/en-US/docs/Web/CSS/length). The visual viewport may change independently of the layout viewport. The implementation reacts at scale 1 and does not counteract user zoom. The test matrix records actual emulation limitations.
