# Strikethrough Button

A Discourse **theme component** that adds a strikethrough button to the composer
toolbar. Works in **both** the rich text (ProseMirror) editor and the plain
markdown editor.

It exists because Discourse core ships a strikethrough *mark* (`~~text~~`) but no
toolbar button for it. This component adds one that toggles the mark cleanly in
the rich editor and falls back to `~~…~~` markdown in the plain-text editor.

## How it works

- **Rich editor:** registers a small [rich editor extension][ext] that adds a
  `toggleStrikethrough` command toggling core's built-in `strikethrough` mark via
  ProseMirror's `toggleMark`. Clean toggle, no stray blocks.
- **Markdown editor:** falls back to wrapping the selection in `~~…~~` (the
  rich-editor `commands` object is absent there, so the button detects it and
  routes to `applySurround`). This mirrors how core's own List button supports
  both editors.
- The button uses a text label (`S`, styled with a line-through) rather than an
  icon, so it needs no changes to the SVG icon subset.
- Strings are localized via `locales/*.yml`. Because theme locale files load under
  `js.theme_translations.<id>` (reachable via `themePrefix`) rather than the
  `composer.*` namespace that core reads, the button title points at a
  `themePrefix` key directly, and the one hardcoded key that core's
  `applySurround` needs (`composer.strikethrough_text`, its empty-selection
  placeholder) is bridged into that namespace at runtime. Locales fall back to
  `en`.

[ext]: https://meta.discourse.org/t/rich-text-editor-extension-api/

## Translations

Add a language by dropping a `locales/<code>.yml` alongside `en.yml`, e.g.
`locales/es.yml`:

```yml
es:
  strikethrough_title: "Tachado"
  strikethrough_text: "texto tachado"
```

`strikethrough_title` is the button tooltip; `strikethrough_text` is the
placeholder inserted when you click with nothing selected. Any locale without a
file falls back to English.

## Install

1. **Admin → Customize → Themes → Components → Install → From a git repository**
   and paste this repo's URL (or **From your device** with a zip).
2. Add the component to your active theme.
3. Hard-refresh and open a composer — you'll see the **S̶** button next to
   Bold / Italic.

## Optional: use the Font Awesome icon instead of the "S"

The default is a text label so it works with zero extra setup. If you'd rather
use the real strikethrough glyph:

1. Add `strikethrough` to the `svg_icons` site setting.
2. In `javascripts/discourse/api-initializers/strikethrough-button.js`, replace
   `translatedLabel: "S"` with `icon: "strikethrough"` and remove
   `common/common.scss`.

## Structure

```
about.json
common/common.scss                                   # strike-through the "S" label
javascripts/discourse/api-initializers/strikethrough-button.js
```

## License

[Apache License 2.0](LICENSE)
