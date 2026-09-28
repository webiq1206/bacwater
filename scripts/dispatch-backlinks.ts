/**
 * Fallback trigger for .github/workflows/backlinks.yml.
 *
 * GitHub deprioritises scheduled workflows and drops runs under load, and it
 * did so here: the first two `40 6 * * *` windows produced no run at all while
 * the same workflow dispatched manually succeeded. A daily job that silently
 * never fires is worse than no job, because the register looks maintained.
 *
 * So the weekly upkeep Routine, which runs on a different scheduler entirely,
 * calls this. It is a FALLBACK, not a second schedule: it looks at when the
 * workflow last ran and only dispatches when the cron appears to have missed.
 * If GitHub's scheduler is behaving, this does nothing and says so.
 *
 * Run: npm run backlinks:dispatch          (dispatch only if stale)
 *      npm run backlinks:dispatch -- --dry-run   (report, change nothing)
 *      npm run backlinks:dispatch -- --force     (dispatch regardless)
 *
 * Authentication differs by environment, and both are supported:
 *
 *  - GitHub Actions supplies a real GITHUB_TOKEN, which is sent as a bearer.
 *  - A Claude Code container supplies a PLACEHOLDER token (literally "prox...")
 *    and authenticates through its egress proxy instead. Sending the
 *    placeholder as a bearer makes GitHub reject the request with 401, so a
 *    token that is not shaped like a real one is deliberately NOT sent and the
 *    proxy's own credentials are used. That flag costs nothing where no proxy
 *    is configured.
 *
 * If neither path is authorised the API says so and this exits non-zero, rather
 * than reporting a dispatch that never happened.
 */

const REPO = process.env.BACKLINK_REPO || "webiq1206/bacwater";
const WORKFLOW = "backlinks.yml";
const REF = "main";
/** A day plus a wide margin, so a merely-late run is never double-triggered. */
const MAX_AGE_HOURS = Number(process.env.BACKLINK_MAX_AGE_HOURS || 26);
const API = "https://api.github.com";

export interface RunSummary {
  created_at: string;
  status: string | null;
  event: string;
}

export interface Decision {
  dispatch: boolean;
  reason: string;
}

/**
 * The whole decision, kept pure so scripts/test-backlinks.ts can exercise it
 * without touching the network.
 */
export function decide(runs: RunSummary[], now: Date, maxAgeHours = MAX_AGE_HOURS, force = false): Decision {
  if (force) return { dispatch: true, reason: "--force was given" };
  if (runs.some(run => run.status !== "completed")) {
    return { dispatch: false, reason: "a run is already queued or in progress" };
  }
  if (!runs.length) return { dispatch: true, reason: "the workflow has never run" };
  const newest = runs.reduce((a, b) => (Date.parse(a.created_at) >= Date.parse(b.created_at) ? a : b));
  const ageHours = (now.getTime() - Date.parse(newest.created_at)) / 3_600_000;
  if (!Number.isFinite(ageHours)) return { dispatch: true, reason: `could not read the last run's timestamp (${newest.created_at})` };
  if (ageHours > maxAgeHours) {
    return { dispatch: true, reason: `the last run was ${ageHours.toFixed(1)}h ago (${newest.event}), past the ${maxAgeHours}h threshold` };
  }
  return { dispatch: false, reason: `the last run was ${ageHours.toFixed(1)}h ago (${newest.event}); the schedule is keeping up` };
}

/**
 * A real GitHub token, or null when the environment only has a proxy
 * placeholder. Classic PATs are 40 hex characters; every modern token carries a
 * ghp_/gho_/ghu_/ghs_/ghr_/github_pat_ prefix. Anything else is not a
 * credential we should present as one.
 */
export function bearerToken(env: Record<string, string | undefined> = process.env): string | null {
  const value = env.GH_TOKEN || env.GITHUB_TOKEN;
  if (!value) return null;
  const real = /^gh[pousr]_[A-Za-z0-9]{20,}$/.test(value) || /^github_pat_[A-Za-z0-9_]{20,}$/.test(value) || /^[0-9a-f]{40}$/.test(value);
  return real ? value : null;
}

async function api(path: string, init: RequestInit = {}): Promise<Response> {
  const bearer = bearerToken();
  return fetch(`${API}${path}`, {
    ...init,
    signal: AbortSignal.timeout(20000),
    headers: {
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "BACwaterBacklinkDispatch/1.0",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

async function main() {
  const force = process.argv.includes("--force");
  const dryRun = process.argv.includes("--dry-run");

  console.log(bearerToken()
    ? "Authenticating with the token in the environment."
    : "No real token present; relying on the environment's proxy credentials.");

  const listed = await api(`/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=10`);
  if (!listed.ok) throw new Error(`Could not list runs: HTTP ${listed.status} ${await listed.text()}`);
  const { workflow_runs: runs = [] } = await listed.json() as { workflow_runs?: RunSummary[] };
  const scheduled = runs.filter(r => r.event === "schedule").length;
  console.log(`Last ${runs.length} run(s), ${scheduled} of them from the schedule.`);

  const decision = decide(runs, new Date(), MAX_AGE_HOURS, force);
  if (!decision.dispatch) {
    console.log(`No dispatch: ${decision.reason}.`);
    return;
  }
  if (dryRun) {
    console.log(`Would dispatch: ${decision.reason}. Nothing sent (--dry-run).`);
    return;
  }

  const sent = await api(`/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
    method: "POST",
    body: JSON.stringify({ ref: REF }),
  });
  // 204 No Content is the success case for this endpoint.
  if (sent.status !== 204) throw new Error(`Dispatch failed: HTTP ${sent.status} ${await sent.text()}`);
  console.log(`Dispatched ${WORKFLOW} on ${REF}: ${decision.reason}.`);
  console.log("This is the fallback path. If it keeps firing, GitHub's cron is not running and the daily cadence is really weekly.");
}

if (/dispatch-backlinks/.test(process.argv[1] || "")) {
  main().catch(error => { console.error(String(error instanceof Error ? error.message : error)); process.exitCode = 1; });
}
