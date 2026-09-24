# Restore the approved editorial hero without losing full-height framing

This narrow update restores the earlier approved V2 composition: the "Your numbers. Made clear." headline, serif emphasis, offset sage backing card, circular linework, large lime result panel and compact tool links. The subject "BAC water calculator" remains part of the visible H1 and Open calculator remains the dominant action.

The previous full-height opening is retained using a minimum dynamic viewport height below the existing header. Following sections start after the opening scene. Small screens use a compact example panel and keep the primary action visible. At enlarged text sizes the scene can grow vertically rather than clipping content or disabling zoom.

The hero's numbers are explicitly marked as an example. They are not editable inputs. Calculator and converter links open the existing dedicated screens, preserving the user's more recent requirement that active calculations have no surrounding website content. No calculator math, database schema, deployment safety, supplier URL or partner setting changes are made.

Scope: homepage hero only. The separately requested full supplier catalog, removal of supplier branding throughout the site and illustrated product selection remain separate work; this release does not claim those are done.

Verification: local TypeScript and existing pure unit suites; retained CI plus added Chromium/WebKit checks for eight viewport sizes, below-fold placement, calculator navigation, age-verified presentation, automated accessibility and enlarged text. Review the final CI outcome before merging. Browser emulation does not certify a physical phone keyboard or screen reader.

Technical references checked September 23, 2026: MDN CSS length documentation (dynamic viewport units) and W3C Understanding 1.4.10 Reflow. No fixed-height clipping, scroll trap or user zoom override is introduced.
