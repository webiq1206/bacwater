import Icon from "../icon";

// Keep legacy bookmarks and crawlers on the same branded image as /icon.
export const runtime = "nodejs";
export function GET() {
  return Icon();
}
