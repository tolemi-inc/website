import Markdoc, { type Node } from '@markdoc/markdoc';

/**
 * Render a Keystatic Markdoc node to HTML for use inside a `.richtext`
 * container. Strips the `<article>` wrapper that Markdoc adds by default
 * so `.richtext > *` selectors (sibling spacing, first-child resets,
 * the `:first-of-type` drop cap) target the real content.
 */
export function renderRichtext(node: Node): string {
  const html = Markdoc.renderers.html(Markdoc.transform(node));
  return html.replace(/^<article>/, '').replace(/<\/article>$/, '');
}
