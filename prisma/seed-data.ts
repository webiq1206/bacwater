/** Defaults for NEW disposable/development databases. Never run the full seed in production. */
import { EDITORIAL_REVISIONS } from "../src/lib/content/editorial-revisions";
export const CONTENT = EDITORIAL_REVISIONS.map(({ slug, kind, title, body }) => ({ slug, kind, title, body }));
