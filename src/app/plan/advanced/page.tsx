import { redirect } from "next/navigation";

// The main /plan route IS the single-page planner now.
// This route is kept as a compatibility redirect for anyone with a bookmark.
export default function PlanAdvancedPage() {
  redirect("/plan");
}
