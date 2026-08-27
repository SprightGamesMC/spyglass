# SKIN

A skin pack: `skins.json`, the skin and cape textures next to it, and the `.lang` files under `texts/` that contain the display name of each skin.

Runs for: world, skin.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| SKIN/101 | skins-json-missing | error | Pack has no skins.json |
| SKIN/102 | loc-key-missing | error | skins.json key not found in en_US.lang |
| SKIN/201 | skins-json-invalid | error | skins.json does not match schema |
| SKIN/202 | localization-name-mismatch | error | localization_name and serialize_name differ |
| SKIN/203 | texture-invalid-size | error | Skin or cape texture has wrong dimensions |
| SKIN/204 | geometry-not-allowed | error | Skin geometry is not a humanoid custom model |
| SKIN/205 | texture-name-no-model-target | error | Texture name has no model marker |
| SKIN/206 | loc-key-whitespace | error | .lang value has leading or trailing spaces |
| SKIN/207 | purchase-type-invalid | error | Skin type is not free or paid |
| SKIN/208 | skin-name-invalid | error | Skin localization_name has a digit or underscore |
| SKIN/301 | texture-not-in-skins-json | error | Texture file not referenced by skins.json |
| SKIN/302 | lang-key-not-in-skins-json | error | Skin .lang key has no matching skin |
| SKIN/401 | too-many-skins | error | More than 80 skins |
| SKIN/402 | too-many-free-skins | error | More than 2 free skins |
| SKIN/403 | too-few-skins | error | Fewer than 5 skins |
| SKIN/601 | texture-duplicate | warning | Two skins share a texture file |
| SKIN/701 | cape-not-allowed | error | Skin has a cape |

SKIN/401, SKIN/402, and SKIN/403 are skipped for the world content type, where the skin count rules do not apply.

## SKIN/101 skins-json-missing

A skin pack has no `skins.json` at its root, so the game can list no skins from it.

Fix: add `skins.json` at the pack root listing every skin.

## SKIN/102 loc-key-missing

A localization key referenced by a skin in `skins.json` is not defined in `texts/en_US.lang`. Only that file is searched.

Fix: add the key with the display name of the skin, or correct the key in `skins.json`.

## SKIN/201 skins-json-invalid

`skins.json` does not match the skin pack schema. Every place where the file does not match is a separate finding.

Fix: correct each reported field.

## SKIN/202 localization-name-mismatch

The pack level `localization_name` and `serialize_name` in `skins.json` differ. Skipped when either is missing or is not a string. The `localization_name` of each skin entry is not compared.

Fix: set both to the same value.

## SKIN/203 texture-invalid-size

A texture a skin refers to has wrong dimensions. Skin textures must be 64x64, 64x32, or 128x128. Cape textures must be 64x32. Dimensions are read from the image file.

Fix: export the texture again at an allowed size.

## SKIN/204 geometry-not-allowed

A skin `geometry` value is not `geometry.humanoid.custom` or `geometry.humanoid.customSlim`.

Fix: set `geometry` to one of the two allowed values.

## SKIN/205 texture-name-no-model-target

A skin texture file name has no marker saying which model it targets. The marker is a whole token, separated by underscores, at the start or the end of the name. Slim markers are `a`, `alex`, `slim`, and `customSlim`. Custom markers are `s`, `steve`, and `custom`.

Fix: rename the texture so its name starts or ends with a model marker token, and update the `texture` field in `skins.json`.

## SKIN/206 loc-key-whitespace

A value in a `.lang` file starts or ends with spaces. Applies to every key in every `.lang` file in the pack, not only skin keys.

Fix: remove the leading or trailing spaces.

## SKIN/207 purchase-type-invalid

A skin `type` field is not `free` or `paid`.

Fix: set `type` to `free` or `paid`.

## SKIN/208 skin-name-invalid

The `localization_name` of a skin entry contains a digit or an underscore. The value is part of the `.lang` key for that skin. The pack level `localization_name` is not checked.

Fix: rename the skin using letters only, and update the matching `skin.` key in every `.lang` file.

## SKIN/301 texture-not-in-skins-json

A texture file in the pack is not listed as a skin texture or a cape in `skins.json`. The `pack_icon` file is exempt.

Fix: reference the texture from a skin entry, or delete the file.

## SKIN/302 lang-key-not-in-skins-json

A key starting with `skin.` or `skinpack.` in a `.lang` file has no matching skin or skin pack in `skins.json`. The pack attribution key `skinpack.<serialize_name>.by` is accepted. The pack is skipped when `skins.json` has no `serialize_name`.

Fix: remove the key, or add the skin it refers to.

## SKIN/401 too-many-skins

`skins.json` lists more than 80 skins.

Fix: remove skins until 80 or fewer remain, or split the pack.

## SKIN/402 too-many-free-skins

`skins.json` lists more than 2 skins with `type` set to `free`.

Fix: change the `type` of extra skins to `paid`.

## SKIN/403 too-few-skins

`skins.json` lists fewer than 5 skins.

Fix: add skins until 5 or more are listed.

## SKIN/601 texture-duplicate

Two skins use the same texture file. Duplicate skin textures and duplicate cape textures are both reported.

Fix: give each skin its own texture file, or remove one of the two skins.

## SKIN/701 cape-not-allowed

A skin entry defines a cape. Skins in a skin pack may not have one.

Fix: remove the `cape` field and delete the cape texture if nothing else uses it.
