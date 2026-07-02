/**
 * Renders a generated SVG infographic inline (crisp at any size, no extra
 * request, machine-readable text) with a caption. The same SVG is also served
 * at a real image URL for ImageObject schema and social cards.
 */
export function Infographic({
  svg,
  caption,
}: {
  svg: string;
  caption?: string;
}) {
  return (
    <figure className="my-0">
      <div
        className="border border-border bg-white overflow-hidden [&>svg]:block [&>svg]:w-full [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <figcaption className="mt-2 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
