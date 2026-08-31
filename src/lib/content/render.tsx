/**
 * The markdown-lite renderer for ContentBlock bodies.
 *
 * Extracted from the /learn/[slug] page so the admin content workspace can
 * preview a guide with the exact markup the published page will emit. Two
 * renderers would drift, and a preview that lies is worse than none.
 *
 * Supported: ## / ### headings, - or * lists, N. lists, | tables |,
 * **bold**, *italic*, blank-line-separated paragraphs.
 */

export function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderBlock(block: string, i: number) {
  if (block.startsWith("### ")) {
    return <h3 key={i} className="mt-8 text-lg font-semibold tracking-tight">{block.slice(4)}</h3>;
  }
  if (block.startsWith("## ")) {
    return <h2 key={i} className="mt-10 text-xl font-semibold tracking-tight">{block.slice(3)}</h2>;
  }

  const lines = block.split("\n");

  // Unordered list: lines starting with "- " or "* "
  if (lines.every((l) => /^[-*]\s/.test(l.trim()))) {
    return (
      <ul key={i} className="mt-4 list-disc pl-6 space-y-1 text-base leading-relaxed text-foreground/90">
        {lines.map((l, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: inlineMarkdown(l.replace(/^[-*]\s/, "").trim()) }} />
        ))}
      </ul>
    );
  }

  // Ordered list: lines starting with "N. "
  if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
    return (
      <ol key={i} className="mt-4 list-decimal pl-6 space-y-1 text-base leading-relaxed text-foreground/90">
        {lines.map((l, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: inlineMarkdown(l.replace(/^\d+\.\s/, "").trim()) }} />
        ))}
      </ol>
    );
  }

  // Markdown table: every line starts with "|"
  if (lines.every((l) => l.trim().startsWith("|"))) {
    const rows = lines
      .filter((l) => !/^\|[-:| ]+\|$/.test(l.trim()))
      .map((l) =>
        l
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cell.trim())
      );
    if (rows.length < 1) {
      return null;
    }
    const [head, ...body] = rows;
    return (
      <div key={i} className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border border-border">
          <thead>
            <tr className="bg-surface text-left">
              {head.map((cell, j) => (
                <th key={j} className="px-3 py-2 font-medium border-b border-border" dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, j) => (
              <tr key={j} className="border-t border-border">
                {row.map((cell, k) => (
                  <td key={k} className="px-3 py-2" dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p
      key={i}
      className="mt-4 text-base leading-relaxed text-foreground/90"
      dangerouslySetInnerHTML={{ __html: inlineMarkdown(block) }}
    />
  );
}

export function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => renderBlock(block, i));
}

