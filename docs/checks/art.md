# ART

The `Marketing Art` and `Store Art` folders at the root of a submission zip: that the required files are present and that their names, formats, sizes, DPI, counts, and shared content name prefix are correct.

Runs for: addon, world, skin, texture, persona. Marketplace layout only.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| ART/101 | marketing-art-folder-missing | error | No Marketing Art folder at the root |
| ART/102 | store-art-folder-missing | error | No Store Art folder at the root |
| ART/103 | marketing-key-art-missing | error | No marketing key art file |
| ART/104 | marketing-partner-art-missing | error | No partner art file |
| ART/105 | store-thumbnail-missing | error | No store thumbnail file |
| ART/106 | store-panorama-missing | error | No store panorama file |
| ART/107 | store-pack-icon-missing | error | No store pack icon file |
| ART/108 | approval-sheet-missing | error | No approval sheet file |
| ART/109 | preview-gif-missing | error | A required preview GIF is absent |
| ART/110 | sideload-pack-missing | error | No SideLoad .mcpack file |
| ART/111 | blockbench-project-missing | error | No Blockbench project file |
| ART/201 | file-name-invalid | error | File in Store Art or Marketing Art does not match an expected name |
| ART/202 | name-prefix-mismatch | error | Art files do not share one content name prefix |
| ART/203 | store-art-format-invalid | error | Store Art file is not JPEG |
| ART/204 | store-thumbnail-size-invalid | error | Store thumbnail is not 800 by 450 |
| ART/205 | store-screenshot-size-invalid | error | Store screenshot is not 800 by 450 |
| ART/206 | store-panorama-size-invalid | error | Store panorama height is not 450 or width is outside 1000 to 4000 |
| ART/207 | store-pack-icon-size-invalid | error | Store pack icon is not 256 by 256 |
| ART/208 | store-art-dpi-invalid | error | Store Art file is not 72 DPI |
| ART/209 | marketing-art-format-invalid | error | Marketing Art file is not JPEG or PSD |
| ART/210 | marketing-art-size-invalid | error | Marketing Art file is not 1920 by 1080 |
| ART/211 | marketing-art-dpi-invalid | error | Marketing Art file is not 300 DPI |
| ART/212 | persona-art-format-invalid | error | Persona thumbnail or approval sheet is not PNG, or preview is not GIF |
| ART/213 | approval-sheet-size-invalid | error | Approval sheet is not 5120 by 1600 |
| ART/214 | persona-thumbnail-not-transparent | error | Persona thumbnail has no alpha channel |
| ART/401 | marketing-screenshots-too-few | error | Fewer than 5 marketing screenshots |
| ART/402 | store-screenshot-count-invalid | error | Store screenshot count is not exactly 5 |

In file names, `name` is the content name in lower case, `Name` is the content name in PascalCase, and `<id>` is the piece identifier as written in the persona or emote meta.

## ART/101 marketing-art-folder-missing

The submission root has no `Marketing Art` folder.

Fix: create it and put the marketing files for your content type inside.

## ART/102 store-art-folder-missing

The submission root has no `Store Art` folder.

Fix: create it and put the store files for your content type inside.

## ART/103 marketing-key-art-missing

`Marketing Art` has no `Name_MarketingKeyArt.jpg` or `Name_MarketingKeyArt.psd`. Addon, world, texture, and skin only.

Fix: add the key art file with the expected name.

## ART/104 marketing-partner-art-missing

`Marketing Art` has no `Name_PartnerArt.jpg` or `Name_PartnerArt.psd`. Addon, world, texture, and skin only.

Fix: add the partner art file with the expected name.

## ART/105 store-thumbnail-missing

`Store Art` has no thumbnail. For addon, world, texture, and skin the file is `name_Thumbnail_0.jpg`, for a persona piece `<id>_Thumbnail_0.png`, and for an emote `<id>_thumbnail_0.png`. Runs for every content type.

Fix: add the thumbnail with the expected name for your content type.

## ART/106 store-panorama-missing

`Store Art` has no `name_panorama_0.jpg`. Addon, world, and texture only.

Fix: add the panorama with the expected name.

## ART/107 store-pack-icon-missing

`Store Art` has no `name_packicon_0.jpg`. Addon, world, and texture only.

Fix: add the pack icon with the expected name.

## ART/108 approval-sheet-missing

`Marketing Art` has no `<id>_ApprovalSheet.png`. Persona pieces only, not emotes.

Fix: add the approval sheet with the expected name.

## ART/109 preview-gif-missing

A required preview GIF is absent from `Marketing Art`. A persona piece needs `<id>_Walking.gif`, `<id>_Running.gif`, `<id>_Swimming.gif`, and `<id>_Crouching.gif`. An emote needs `<id>.gif`. One finding per missing file. Persona and emote only.

Fix: add every missing GIF with the expected name.

## ART/110 sideload-pack-missing

`Marketing Art` has no `<id>_SideLoad.mcpack`. Persona and emote only.

Fix: add the `.mcpack` file with the expected name.

## ART/111 blockbench-project-missing

`Marketing Art` has no `<id>_BlockbenchProject.bbmodel`. Persona and emote only.

Fix: add the Blockbench project with the expected name.

## ART/201 file-name-invalid

A file in `Store Art` or `Marketing Art` matches none of the expected names for the content type.

Addon, world, texture, and skin, in `Store Art`: `name_Thumbnail_0.jpg`, `name_screenshot_0.jpg` to `name_screenshot_4.jpg`, `name_panorama_0.jpg`, `name_packicon_0.jpg`. The same types in `Marketing Art`, with extension `.jpg` or `.psd`: `Name_MarketingKeyArt`, `Name_MarketingScreenshot_0` and higher, `Name_PartnerArt`.

Persona piece, in `Store Art`: `<id>_Thumbnail_0.png`. In `Marketing Art`: `<id>_ApprovalSheet.png`, `<id>_Walking.gif`, `<id>_Running.gif`, `<id>_Swimming.gif`, `<id>_Crouching.gif`, `<id>_SideLoad.mcpack`, `<id>_BlockbenchProject.bbmodel`.

Emote, in `Store Art`: `<id>_thumbnail_0.png`. In `Marketing Art`: `<id>.gif`, `<id>_SideLoad.mcpack`, `<id>_BlockbenchProject.bbmodel`.

Fix: rename the file to an expected name, or remove it from the folder.

## ART/202 name-prefix-mismatch

Art files with a recognized role do not share one content name prefix. The prefix of a file is the part of its name before the role suffix. The reference prefix for `Marketing Art` is the prefix of the key art file, or, when there is no key art file, the prefix used by the most `Marketing Art` files. Every `Marketing Art` file must use that prefix and every `Store Art` file its lower case form. When there are no `Marketing Art` files, the reference prefix is the prefix used by the most `Store Art` files. For persona and emote the reference prefix is `<id>`, with no case change.

Fix: rename the files so they all share the reference prefix.

## ART/203 store-art-format-invalid

A file in `Store Art` is not a JPEG. Skipped for persona and emote, whose art is PNG and GIF.

Fix: export the file as JPEG with the `.jpg` extension.

## ART/204 store-thumbnail-size-invalid

The store thumbnail is not 800 by 450 pixels. Skipped for persona and emote.

Fix: export the thumbnail again at 800 by 450.

## ART/205 store-screenshot-size-invalid

A store screenshot is not 800 by 450 pixels. Skipped for persona and emote.

Fix: export the screenshot again at 800 by 450.

## ART/206 store-panorama-size-invalid

The store panorama is not 450 pixels high, or its width is outside 1000 to 4000 pixels. Skipped for persona and emote.

Fix: export the panorama again inside those dimensions.

## ART/207 store-pack-icon-size-invalid

The store pack icon is not 256 by 256 pixels. Skipped for persona and emote.

Fix: export the pack icon again at 256 by 256.

## ART/208 store-art-dpi-invalid

A file in `Store Art` is not saved at 72 DPI. Skipped for persona and emote.

Fix: export the file again with the resolution set to 72 DPI.

## ART/209 marketing-art-format-invalid

An image in `Marketing Art` is not a JPEG or PSD file. Skipped for persona and emote, whose art is PNG and GIF.

Fix: export the file as JPEG or PSD with a matching extension.

## ART/210 marketing-art-size-invalid

An image in `Marketing Art` is not 1920 by 1080 pixels. Skipped for persona and emote.

Fix: export the file again at 1920 by 1080.

## ART/211 marketing-art-dpi-invalid

An image in `Marketing Art` is not saved at 300 DPI. Skipped for persona and emote.

Fix: export the file again with the resolution set to 300 DPI.

## ART/212 persona-art-format-invalid

The thumbnail or approval sheet is not a PNG, or a preview is not a GIF. Persona and emote only.

Fix: export the thumbnail and approval sheet as PNG and the previews as GIF, with matching extensions.

## ART/213 approval-sheet-size-invalid

The persona approval sheet is not 5120 by 1600 pixels. Persona pieces only, not emotes.

Fix: export the approval sheet again at 5120 by 1600.

## ART/214 persona-thumbnail-not-transparent

The thumbnail in `Store Art` has no alpha channel, so it cannot be shown on a transparent background. Persona and emote only.

Fix: export the thumbnail as a PNG with transparency enabled.

## ART/401 marketing-screenshots-too-few

`Marketing Art` has fewer than 5 files named `Name_MarketingScreenshot_0` and higher. Addon, world, and texture only.

Fix: add screenshots until there are at least 5, numbered from `_0` upward.

## ART/402 store-screenshot-count-invalid

`Store Art` does not have exactly 5 files named `name_screenshot_0.jpg` to `name_screenshot_4.jpg`. Addon, world, and texture only.

Fix: add or remove store screenshots until there are exactly 5.

## Notes

Format, dimensions, and DPI for ART/203 to ART/214 are read from image metadata, PSD included. Missing DPI metadata counts as invalid. The required set per content type is in [Layouts](../layouts.md#art).
