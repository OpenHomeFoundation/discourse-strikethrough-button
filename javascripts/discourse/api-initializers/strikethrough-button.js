import { apiInitializer } from "discourse/lib/api";
import I18n, { i18n } from "discourse-i18n";

export default apiInitializer((api) => {
  // Localized strings live in this component's `locales/*.yml`, which load under
  // `js.theme_translations.<id>` (reachable via `themePrefix`). The button title
  // can point at a themePrefix key directly, since addButton runs `title` through
  // i18n. But `applySurround` reads a *hardcoded* `composer.strikethrough_text`
  // key for its empty-selection placeholder, so bridge just that one string into
  // the `composer.*` namespace where core looks. Falls back to `en` per-locale.
  const locale = I18n.currentLocale();
  I18n.translations ??= {};
  I18n.translations[locale] ??= {};
  I18n.translations[locale].js ??= {};
  const composer = (I18n.translations[locale].js.composer ??= {});
  composer.strikethrough_text ??= i18n(themePrefix("strikethrough_text"));

  // Rich text (ProseMirror) editor: add a command that toggles core's
  // built-in `strikethrough` mark. No new schema needed — core already has it.
  api.registerRichEditorExtension({
    commands: ({ pmCommands, schema }) => ({
      toggleStrikethrough() {
        return pmCommands.toggleMark(schema.marks.strikethrough);
      },
    }),
  });

  // Toolbar button that works in BOTH editors.
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "strikethrough",
      group: "fontStyles",
      translatedLabel: "S", // styled with a line-through in common/common.scss
      title: themePrefix("strikethrough_title"),
      perform: (event) => {
        // Rich editor: toggleStrikethrough() runs and returns true.
        // Plain markdown editor: `event.commands` is undefined, so we
        // fall through to inserting `~~...~~` markdown instead.
        if (
          !event.commands?.toggleStrikethrough ||
          !event.commands.toggleStrikethrough()
        ) {
          event.applySurround("~~", "~~", "strikethrough_text");
        }
      },
    });
  });
});
