import { revalidatePath } from "next/cache";
export function revalidatePublication(slugs: Array<string | undefined> = []) {
  for (const path of ["/learn", "/faq", "/sitemap", "/sitemap-learn.xml", "/llms.txt"]) revalidatePath(path);
  for (const slug of new Set(slugs)) if (slug) revalidatePath(`/learn/${slug}`);
}
