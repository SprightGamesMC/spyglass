# LANG

The `texts` folder of each pack: that `languages.json` exists, has the right structure, and matches the `.lang` files next to it, and that definitions the player sees by name have a key in `en_US.lang`. Unused keys are never reported, because keys can be used from UI files or built at runtime by scripts.

Runs for: addon, world, skin, texture, persona.

Only the `texts` folder at the pack root is read. A `texts` folder inside a subpack provides no language files and no keys.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| LANG/101 | languages-json-missing | error | Pack has no texts/languages.json |
| LANG/102 | en-us-missing | error | languages.json does not list en_US |
| LANG/103 | lang-file-missing | error | languages.json entry has no matching .lang file |
| LANG/104 | definition-name-key-missing | warning | Entity, item, or block has no name key in en_US.lang |
| LANG/201 | languages-json-invalid | error | languages.json is not a list of language codes |
| LANG/202 | lang-line-invalid | error | .lang line is not a key and value separated by = |
| LANG/301 | lang-file-not-in-catalog | error | .lang file code is not in languages.json |
| LANG/601 | lang-key-duplicate | error | .lang file has the same key more than once |
| LANG/701 | profanity-in-text | error | .lang value contains a word from the profanity list |

## LANG/101 languages-json-missing

The pack has no `texts/languages.json`, so the game does not know which language files the pack provides.

Fix: add `texts/languages.json`, a JSON array of language codes such as `["en_US"]`.

## LANG/102 en-us-missing

`texts/languages.json` does not list `en_US`. Codes are matched case sensitive, so `en_us` does not count.

Fix: add `"en_US"` to the array and provide `texts/en_US.lang`.

## LANG/103 lang-file-missing

A code listed in `texts/languages.json` has no matching `.lang` file in the `texts` folder. The code is matched against the file name without the extension, case sensitive.

Fix: add the `.lang` file with the exact name of the code, or remove the code from `texts/languages.json`.

## LANG/104 definition-name-key-missing

Runs for: addon, world.

A behavior pack entity, item, or block has no display name key in any `en_US.lang` in any pack of the input, so the game shows the key text to the player. The keys are:

- Entity: `entity.<identifier>.name`. When `description.is_spawnable` is `true`, also `item.spawn_egg.entity.<identifier>.name`.
- Item: `item.<identifier>.name` or `item.<identifier>`.
- Block: `tile.<identifier>.name`.

For an item or block with a `minecraft:display_name` component with a string `value`, that value is accepted as the key instead. Identifiers in the `minecraft:` namespace are skipped. Skipped when no pack has an `en_US.lang`, since LANG/101 and LANG/103 report that. Keys in other language files do not count.

Fix: add the key to `texts/en_US.lang` in the resource pack.

## LANG/201 languages-json-invalid

`texts/languages.json` is not a JSON array of strings. An object, a single string, or an array with non string values is reported.

Fix: rewrite the file as a plain array of language code strings.

## LANG/202 lang-line-invalid

A line in a `.lang` file is not a key and a value separated by `=`. Blank lines and lines that start with `##` are skipped. Reported cases: a line that starts with a single `#`, a line with no `=`, an empty key, and an empty value. One finding per line, with the line number.

Fix: write the line as `key=value`, start a comment with `##`, or delete the line.

## LANG/301 lang-file-not-in-catalog

A `.lang` file in the `texts` folder has a name that is not listed in `texts/languages.json`. The match is case sensitive.

Fix: add the code to `texts/languages.json`, or rename or remove the `.lang` file.

## LANG/601 lang-key-duplicate

A `.lang` file has the same key on more than one line. The game keeps one of them, so the other translation is lost. One finding per repeated key.

Fix: remove or rename the repeated lines so each key appears once.

## LANG/701 profanity-in-text

The value of a `.lang` entry contains a word from the list in `src/Data/ProfanityWords.ts`. The list holds 771 entries and is stored base64 encoded, so the words are not readable in the source. It covers several languages, including entries with no Latin letters.

An entry made only of letters and digits is matched as a whole word, ignoring case, so a longer word that merely contains it is not reported. Every other entry, meaning one with a space or a character outside letters and digits, is matched anywhere inside the value. Keys are not checked, only values.

Fix: reword the value. Use `--skip LANG/701` when a match is a real word in your content.
