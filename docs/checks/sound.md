# SOUND

The `sound_definitions.json` file inside a resource pack, which maps sound event names to audio files.

Runs for: addon, world, texture.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| SOUND/201 | definitions-invalid | error | sound_definitions.json does not match schema |
| SOUND/601 | multiple-definitions-files | error | More than one sound_definitions.json in one pack |

## SOUND/201 definitions-invalid

The file is compared against the expected schema. A file with `format_version` or `sound_definitions` at the top level uses the modern schema, any other file the legacy schema where every top level key is a sound definition. Schema issues are grouped by kind, such as a missing required field or a wrong value type, and each kind produces one finding. The message lists up to three field paths for that kind, and the location is the first of them.

Fix: correct each field listed in the findings so the structure matches the schema.

## SOUND/601 multiple-definitions-files

A pack contains more than one file named `sound_definitions.json`, in any folder.

Fix: merge the entries into one `sound_definitions.json` in the `sounds` folder and delete the extra copies.
