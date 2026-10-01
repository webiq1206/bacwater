# Backlink verification
Generated 2026-10-01T13:50:15.094Z from `backlinks/ledger.json`. Destination site: https://bacwater.ai.
Every row below is the result of reading the live page in this run. A placement is reported as dofollow only when an anchor to the destination host was found with no equity-blocking `rel` and no page-level nofollow. Rows under **Could not verify** are exactly that: no conclusion, in either direction.
Ledger statuses: opportunity 8, submitted 0, discovered 0, live 0, live-nofollow 0, rejected 0.

## Published and verified dofollow
_None._

## Published but nofollow, ugc or sponsored
These are live links that pass no ranking signal. They are kept in the register so the distinction stays visible.

_None._

## Found or submitted, not yet confirmed live
_None._

## Could not verify
The page could not be read in this run, so nothing is claimed about it. Re-run once the blocker is gone.

_None._

## Opportunities, nothing submitted
No link exists for any row here. Each one names the method and what has to happen next.

| Domain | Ledger status | Method | Intended destination | Next step |
| --- | --- | --- | --- | --- |
| (first third-party site to install the widget) | opportunity | Third-party installs the /embed snippet. The attribution anchor sits in the host page's own markup, outside the iframe, so it is a real external link the host editorially places and controls. | /tools/bac-water | The mechanism shipped in this change. Add one record per host page as installs appear in referrer data or a site: search, then run the verifier: a snippet that carried no rel can still be output with rel="ugc" or rel="nofollow" by the host's CMS. |
| alternativeto.net | opportunity | Free listing created in the site's own submission flow. No email outreach. | /peptide-calculator | Needs an account on the platform, which needs an authorised identity and a mailbox the owner controls. Once the listing is live, record the listing URL here and run the verifier. |
| saashub.com | opportunity | Free product listing submitted through the platform's own form. | /peptide-calculator | Needs a platform account. After the listing is approved, add the listing URL and verify the attribute rather than assuming it. |
| producthunt.com | opportunity | Self-submitted product post. | /peptide-calculator | Decide whether it is worth the effort at all. Kept in the register mainly as the clearest example of why domain authority is not the criterion. |
| wikidata.org | opportunity | Create or extend the structured item for the site as an entity, with the official-website property. | / | Only worth doing if the site meets the project's own notability and sourcing expectations. Judge that honestly first; an item that does not belong there will be deleted and the effort wasted. |
| (package registry aggregators) | opportunity | Publish the reconstitution arithmetic in src/lib/calc as a standalone open-source package with the site as its homepage field. Registry aggregators then generate pages that render that homepage URL, without anyone being contacted. | /methodology | Two blockers, both real. It needs a publish token for the registry, and it needs a decision on maintaining a public package (versioning, issues, a licence). Neither is settled, so nothing has been published. |
| zenodo.org | opportunity | Self-deposit the methodology and its worked arithmetic as a citable record with a DOI. Self-service, no outreach, no gatekeeper. | /methodology | Decide whether the methodology is genuinely a citable artifact separate from the page. If it is, it needs an account, an author identity, and a licence choice by the owner. |
| (subject-matter forums and communities) | opportunity | Answer reconstitution arithmetic questions where they are already being asked, linking the calculator only where it actually answers the question. | /tools/bac-water | Not started, and not something to automate. It needs a real, identified participant who can stand behind answers on a health-adjacent subject. Posting under a manufactured persona would be misrepresentation, and drive-by links are removed by moderators anyway. |

## Status changes
_The ledger already matches what was read._
