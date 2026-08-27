# FILE

Every file and path inside the content: that JSON files can be read and parsed, and that paths are safe on every platform the game runs on.

Runs for: addon, world, skin, texture, persona.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| FILE/201 | json-invalid | error | File does not parse as JSON |
| FILE/202 | json-empty | error | JSON file is empty |
| FILE/203 | json-not-utf8 | error | JSON file is not valid UTF-8 text |
| FILE/204 | byte-order-mark | error | JSON file starts with a byte order mark |
| FILE/205 | path-has-uppercase | recommendation | Path contains uppercase letters |
| FILE/206 | path-invalid-character | error | Path contains a character or name that is not safe on every platform |
| FILE/207 | file-unreadable | error | File exists but its bytes could not be read |
| FILE/401 | path-too-long | error | Path longer than 80 characters |
| FILE/402 | path-too-deep | error | Path has more than 7 folder segments |
| FILE/601 | path-case-collision | error | Two paths differ only by letter case |

Paths are measured from the pack root, not the input root. A file outside any pack is measured from the input root. Container folders such as `behavior_packs` and the pack folder itself are removed first. This applies to FILE/205, FILE/401, and FILE/402.

## FILE/201 json-invalid

A `.json` file decodes as text but does not parse as JSON. Comments are tolerated. Trailing commas and other non standard syntax are not.

Fix: correct the syntax. A JSON validator in your editor shows the exact position.

## FILE/202 json-empty

A `.json` file has fewer than 2 characters, so a file with a single character or only whitespace is also reported.

Fix: write a valid JSON document, or delete the file.

## FILE/203 json-not-utf8

A `.json` file could not be decoded as `UTF-8` text. A file that decodes but does not parse is FILE/201 instead.

Fix: save the file again with `UTF-8` encoding.

## FILE/204 byte-order-mark

A `.json` file starts with a byte order mark.

Fix: save the file again as `UTF-8` without a byte order mark.

## FILE/205 path-has-uppercase

A file or folder path contains uppercase letters. Exempt:

- `.lang` files
- the `texts` folder
- the `scripts` folder
- the world `db` folder, where the game sets the file names
- the `font` folder, where glyph file names use uppercase hex
- a path that matches a vanilla file path ignoring case, since the pack overrides a file whose name comes from the game
- every file in a persona pack, where PERSONA/206 reports uppercase texture names as an error

The Marketing Art and Store Art folders are skipped.

Fix: rename to lowercase and update every reference to the old path.

## FILE/206 path-invalid-character

A file or folder path contains a character or name that is not safe on every platform: the `$` character, the characters `<`, `>`, `:`, `"`, `|`, `?`, and `*`, a control character, a name that ends in a dot or a space, or one of the reserved names `CON`, `PRN`, `AUX`, `NUL`, `COM1` to `COM9`, and `LPT1` to `LPT9`.

Fix: rename so the path uses only letters, digits, underscores, and dots, with no trailing dot or space.

## FILE/207 file-unreadable

A file inside the content exists but its bytes could not be read, such as a truncated archive entry or a permission error. Other checks skip that file. A read error outside the content is a tool failure and ends the run with exit code 3 instead.

Fix: replace the file with a valid copy, build the archive again, or correct the file permissions.

## FILE/401 path-too-long

A path is longer than 80 characters.

Fix: shorten names along the path or move the file to a shallower folder.

## FILE/402 path-too-deep

A path has more than 7 folder segments.

Fix: move the file so the path has at most 7 folder segments.

## FILE/601 path-case-collision

Two or more paths are the same when letter case is ignored. One finding per colliding set, listing every member.

Fix: rename or remove files so each path is unique when letter case is ignored.
