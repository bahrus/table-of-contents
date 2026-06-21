# toc-ky

A lightweight web component that automatically generates a sticky table of contents from the headings on your page.

## What it does

`<toc-ky>` scans the document for heading elements (`h1`–`h6`), builds a nested navigation list, and renders it inside a Shadow DOM container. It stays fixed in the viewport as the user scrolls, and highlights the currently visible section (scroll spy). If the page content changes dynamically, the TOC rebuilds itself via a MutationObserver.

Key behaviors:

- **Auto-generates IDs** — headings that don't already have an `id` attribute get one assigned so anchor links work.
- **Scroll spy** — uses an IntersectionObserver to highlight the link corresponding to the heading currently in view.
- **Smooth scrolling** — clicking a TOC link smoothly scrolls to the target heading and updates the URL hash.
- **Sticky positioning** — the component uses `position: sticky` so it stays visible while the user scrolls through content.
- **Dynamic content support** — a MutationObserver watches `document.body` and re-renders the TOC when the DOM changes.
- **Shadow DOM encapsulation** — styles are scoped and won't leak into or be affected by the host page.
- **CSS Parts** — exposes `toc-title`, `toc-list`, `toc-item`, and `toc-link` parts for external styling via `::part()`.

## Installation

### npm

```bash
npm install toc-ky
```

```js
import 'toc-ky';
```

### CDN

```html
<script type="module">
  import 'https://esm.sh/toc-ky/toc-ky.js';
</script>
```

## Usage

Drop the element anywhere on your page:

```html
<toc-ky></toc-ky>
```

The component will pick up all `h1`–`h6` elements in the document by default.

### Custom heading selector

Use the `selector` attribute to limit which headings appear in the TOC:

```html
<!-- Only include h2 and h3 -->
<toc-ky selector="h2, h3"></toc-ky>

<!-- Only headings inside a specific container -->
<toc-ky selector=".content h2, .content h3"></toc-ky>
```

## Styling with CSS Parts

Because the component uses Shadow DOM, you style it from the outside using `::part()`:

```css
toc-ky::part(toc-title) {
  font-size: 1.5rem;
  color: darkblue;
}

toc-ky::part(toc-link) {
  color: #333;
}

toc-ky::part(toc-link):hover {
  color: hotpink;
}
```

Available parts: `toc-title`, `toc-list`, `toc-item`, `toc-link`.

## How it works internally

1. On `connectedCallback`, the component renders the TOC and sets up a MutationObserver.
2. `getHeadings()` queries the document using the configured selector and assigns IDs to any headings that lack one.
3. `buildTOCItems()` generates the list markup, indenting items based on heading level.
4. `setupScrollSpy()` creates an IntersectionObserver that toggles an `.active` class on the corresponding link as headings enter the viewport.
5. The MutationObserver watches for DOM changes and triggers a full re-render so the TOC stays in sync with dynamic content.

## License

MIT
