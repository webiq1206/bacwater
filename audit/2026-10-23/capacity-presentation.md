# Selected scale capacity presentation

Reported live case: 10 mg total, 10,000 mcg entered mass, 2 mL volume, selected 1 mL/100-unit scale. Arithmetic remains 2 mL/200 units. This change presents the capacity incompatibility before the primary numeric equivalent and includes it in copied text. The visual remains hidden when capacity is exceeded. Shared capacity, between-mark and small-volume warnings explain scale limitations without suggesting preparation changes or a different device.

Base main dc7aff5c7851d5978ae3c3655418bdc13abbb50a was fetched and verified. Its automated backlink records are preserved. Open PR45 remains untouched. Recovery bundle: bacwater-before-capacity-fix.bundle in the parent workspace.

Validation: existing npm test and production build passed. Unit tests cover below/at/above each of five scale capacities without changing math. Isolated Chromium and WebKit browser tests passed at390x844 and1440x900 with external requests blocked: 99/100/101/200-unit states on the 1mL scale, mg/mcg toggles, U-100/mL scale switches, overcapacity graphic suppression, visible warning ahead of numeric output, copied warning and horizontal containment. Screenshots visually reviewed. CI adds this browser test alongside converters; no prior assertion, timeout, dependency or gate removed.

No schema, credentials, production or Replit changes. Public standard GitHub runners with log-only evidence remain the no-new-cost route; no artifact/cache upload added. GitHub billing documentation reconfirmed October23. This is source acceptance, not a claim of live deployment.
