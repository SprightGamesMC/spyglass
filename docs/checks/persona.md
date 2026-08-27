# PERSONA

Persona piece packs and emote packs, which both use the `persona` content type: the `.meta.json` file that describes the piece, the textures and geometry it refers to, the pack manifest module, and the `texts/` folder. Rules that apply only to emotes are in [EMOTE](emote.md).

Runs for: persona.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| PERSONA/101 | meta-file-missing | error | Pack has no .meta.json |
| PERSONA/102 | meta-field-missing | error | Meta lacks piece_id, piece_name, or piece_type |
| PERSONA/103 | title-missing | error | No persona.<id>.title key in en_US.lang |
| PERSONA/104 | sources-missing | error | Piece has neither texture_sources nor geometry_sources |
| PERSONA/105 | geometry-variant-missing | error | Geometry is not provided for every required body size, arm size, or side |
| PERSONA/201 | meta-invalid | error | Meta does not match schema |
| PERSONA/202 | piece-id-invalid | error | piece_id is not a GUID |
| PERSONA/203 | piece-name-mismatch | error | piece_name differs from the meta file name without the extension |
| PERSONA/204 | piece-type-unknown | error | piece_type is not a known value |
| PERSONA/205 | identifier-invalid | error | Piece identifier has characters outside letters, digits, underscore, period, hyphen, or ends in a period |
| PERSONA/206 | texture-name-not-lowercase | error | Texture file name has upper case letters |
| PERSONA/207 | texture-format-invalid | error | Texture or tint map is not PNG or TGA |
| PERSONA/208 | body-texture-size-invalid | error | Body texture width is not 128 |
| PERSONA/209 | head-texture-size-invalid | error | Head texture width is not 32 |
| PERSONA/210 | geometry-texture-size-invalid | error | Geometry texture is not square or not a power of two |
| PERSONA/211 | animated-texture-invalid | error | Flipbook frame is not 32 by 32 or 128 by 128, or frame count is not a power of two |
| PERSONA/212 | geometry-identifier-invalid | error | Geometry id is not in geometry.<name>.<body_size>[.<arm_size>][.<side>][.<zone>] form |
| PERSONA/213 | size-value-invalid | error | body_size, arm_size, or side is not a known value |
| PERSONA/214 | zone-unknown | error | Zone name is not a known zone |
| PERSONA/215 | module-type-mismatch | error | Manifest module type is not persona_piece |
| PERSONA/216 | tint-color-invalid | error | Tint color value is not a hex color |
| PERSONA/301 | texture-not-found | error | Meta texture or tint map refers to a file not in the pack |
| PERSONA/302 | geometry-not-found | error | Meta geometry id is not defined in the geometry file |
| PERSONA/303 | texture-unreferenced | warning | Image file in the pack is not listed in the meta |
| PERSONA/304 | geometry-unreferenced | warning | Geometry id in the geometry file is not listed in the meta |
| PERSONA/401 | texture-frames-over-limit | error | More than 32 frames at 32 px or more than 16 frames at 128 px |
| PERSONA/501 | geometry-format-version-invalid | error | Geometry file format_version is not 1.8.0 |
| PERSONA/601 | multiple-meta-files | error | More than one .meta.json in the pack |
| PERSONA/602 | zone-overlap | error | Piece level zones overlap cube or geometry level zones |
| PERSONA/701 | piece-type-not-submittable | error | piece_type is a base body type partners cannot submit |

A check marked "Persona pieces only" skips packs whose meta `piece_type` is `persona_emote`. Every other check runs for both kinds of pack.

## PERSONA/101 meta-file-missing

The pack contains no `.meta.json` file describing the piece.

Fix: add a `<piece_name>.meta.json` file. The persona export in Blockbench produces it.

## PERSONA/102 meta-field-missing

The `.meta.json` file lacks `piece_id`, `piece_name`, or `piece_type`.

Fix: add the missing field. `piece_id` is a GUID, `piece_name` is the file name without the extension, and `piece_type` is a known piece type.

## PERSONA/103 title-missing

`texts/en_US.lang` has no `persona.<id>.title` key, where `<id>` is the piece identifier. Persona pieces only. Emotes use `persona.offer.title`, checked by EMOTE/104.

Fix: add the key with the display name of the piece.

## PERSONA/104 sources-missing

The `.meta.json` file has neither `texture_sources` nor `geometry_sources`, so the piece has nothing to render. Persona pieces only.

Fix: add a `texture_sources` list, a `geometry_sources` list, or both.

## PERSONA/105 geometry-variant-missing

A piece with geometry does not supply a variant for every body shape the game can show. Persona pieces only. The required set is:

- Every piece type needs the body sizes `tall`, `medium`, `small`, and `smaller`.
- `persona_hand` and `persona_arms` need every body size combined with both arm sizes, `wide` and `slim`.
- `persona_arms` and `persona_legs` need both sides, `right` and `left`, for each combination.
- No other piece type needs arm sizes or sides.

An entry that omits `arm_size` or `side` counts for every arm size or side.

Fix: add a `geometry_sources` entry for each missing combination and define the matching geometry.

## PERSONA/201 meta-invalid

The `.meta.json` file does not match the expected schema. Every place where it does not match is a separate finding. Allowed top level keys: `piece_id`, `piece_name`, `piece_type`, `zone`, `tint_base_color`, `tint_color`, `allow_tint_override`, `texture_sources`, `geometry_sources`, `animation_sources`.

Allowed keys in a `texture_sources` entry: `texture`, `tint_map`, `use_face_uv`, `animated`, `frames`.

Allowed keys in a `geometry_sources` entry: `geometry`, `body_size`, `arm_size`, `side`, `zone`, `texture`, `tint_map`, `animated`, `frames`.

Fix: remove keys outside the allowed lists and correct values with the wrong type.

## PERSONA/202 piece-id-invalid

The `piece_id` value is not a GUID.

Fix: set `piece_id` to a valid GUID, generating a new one if the piece has none.

## PERSONA/203 piece-name-mismatch

The `piece_name` value differs from the name of the `.meta.json` file without the extension.

Fix: rename the file or change `piece_name` so the two match.

## PERSONA/204 piece-type-unknown

The `piece_type` value is not one of the known piece types: `persona_top`, `persona_bottom`, `persona_high_pants`, `persona_dress`, `persona_outerwear`, `persona_hood`, `persona_head`, `persona_hand`, `persona_feet`, `persona_face_accessory`, `persona_back`, `persona_arms`, `persona_legs`, `persona_skin`, `persona_hair`, `persona_eyes`, `persona_mouth`, `persona_facial_hair`, `persona_capes`, `persona_emote`.

Fix: set `piece_type` to one of these values.

## PERSONA/205 identifier-invalid

The piece identifier uses a character outside letters, digits, underscore, period, and hyphen, or ends in a period.

Fix: change the identifier to use only those characters and not end in a period.

## PERSONA/206 texture-name-not-lowercase

A texture file name has an upper case letter. Persona pieces only.

Fix: rename the file to lower case and update every reference in the `.meta.json` file.

## PERSONA/207 texture-format-invalid

A `texture` or `tint_map` listed in the `.meta.json` file is not a PNG or TGA file. Persona pieces only.

Fix: convert the file to PNG or TGA and update the reference.

## PERSONA/208 body-texture-size-invalid

A body texture is not 128 pixels wide. A body texture is a `texture_sources` entry without `use_face_uv` set to true. The size is read from the image file, using the TGA header for TGA files. Persona pieces only.

Fix: export the texture again at a width of 128 pixels.

## PERSONA/209 head-texture-size-invalid

A head texture is not 32 pixels wide. A head texture is a `texture_sources` entry with `use_face_uv` set to true. The size is read from the image file, using the TGA header for TGA files. Persona pieces only.

Fix: export the texture again at a width of 32 pixels.

## PERSONA/210 geometry-texture-size-invalid

A texture listed in a `geometry_sources` entry is not square, or its side is not a power of two. Persona pieces only.

Fix: export the texture again at a square power of two size.

## PERSONA/211 animated-texture-invalid

For a texture source with `animated` set to true, the image is a flipbook of frames stacked in a column. Each frame must be 32 by 32 or 128 by 128, and the frame count, which is the image height divided by the frame size, must be a power of two. Persona pieces only.

Fix: export the texture again with an allowed frame size and a power of two frame count.

## PERSONA/212 geometry-identifier-invalid

A geometry id does not follow the form `geometry.<name>.<body_size>[.<arm_size>][.<side>][.<zone>]`. The parts in brackets are optional. Persona pieces only.

Fix: rename the geometry id in both the geometry file and the `.meta.json` file.

## PERSONA/213 size-value-invalid

A `body_size`, `arm_size`, or `side` value in a `geometry_sources` entry is not known. `body_size` is `tall`, `medium`, `small`, or `smaller`. `arm_size` is `wide` or `slim`. `side` is `right` or `left`. Persona pieces only.

Fix: set the field to one of the allowed values.

## PERSONA/214 zone-unknown

A zone name in the `.meta.json` file is not a known zone. Persona pieces only. Known zones:

- `over_hair`
- `head_top`, `head_front`, `head_back`, `head_left`, `head_right`
- `body_front_upper`, `body_front_lower`, `body_back_upper`, `body_back_lower`
- `right_arm_upper`, `right_arm_middle`, `right_arm_lower`
- `left_arm_upper`, `left_arm_middle`, `left_arm_lower`
- `right_leg_upper`, `right_leg_middle`, `right_leg_lower`
- `left_leg_upper`, `left_leg_middle`, `left_leg_lower`
- `right_leg`, `right_leg_clothing`
- `left_leg`, `left_leg_clothing`

Fix: replace the zone name with one from the list.

## PERSONA/215 module-type-mismatch

The module in the pack manifest has a `type` other than `persona_piece`.

Fix: set the module `type` in `manifest.json` to `persona_piece`.

## PERSONA/216 tint-color-invalid

An `r_color`, `g_color`, `b_color`, or `a_color` value inside `tint_base_color` or `tint_color` is not a hex color in `#RRGGBB` form. Persona pieces only.

Fix: set each color value to a `#RRGGBB` string.

## PERSONA/301 texture-not-found

A `texture` or `tint_map` listed in the `.meta.json` file has no matching file in the pack. Persona pieces only.

Fix: add the file, or correct the name in the `.meta.json` file.

## PERSONA/302 geometry-not-found

A geometry id listed in a `geometry_sources` entry is not defined in the geometry file. Persona pieces only.

Fix: add the geometry, or correct the id in the `.meta.json` file.

## PERSONA/303 texture-unreferenced

An image file in the pack is not listed in the `.meta.json` file. `contents.json` and `signatures.json` at the pack root are ignored, and the `pack_icon` file is exempt. Persona pieces only.

Fix: reference the image from a `texture_sources` or `geometry_sources` entry, or delete it.

## PERSONA/304 geometry-unreferenced

A geometry id defined in the geometry file is not listed in the `.meta.json` file. Persona pieces only.

Fix: add a `geometry_sources` entry that refers to it, or remove it from the geometry file.

## PERSONA/401 texture-frames-over-limit

An animated texture has more frames than its frame size allows: at most 32 frames at 32 pixels, at most 16 frames at 128 pixels. The frame count is the image height divided by the frame size. Persona pieces only.

Fix: reduce the number of frames.

## PERSONA/501 geometry-format-version-invalid

The `format_version` of the geometry file is not `1.8.0`. Persona pieces only.

Fix: set `format_version` to `1.8.0` and check that the geometry uses that format.

## PERSONA/601 multiple-meta-files

The pack contains more than one `.meta.json` file.

Fix: keep one per pack and move each extra piece into its own pack.

## PERSONA/602 zone-overlap

A zone set at the piece level in the `.meta.json` file overlaps a zone set at the geometry level in a `geometry_sources` entry or at the cube level in the geometry file. Persona pieces only.

Fix: remove the zone from one of the two levels so each zone is set in one place.

## PERSONA/701 piece-type-not-submittable

The `piece_type` is a base body type partners cannot submit: `persona_skin`, `persona_hair`, `persona_eyes`, `persona_mouth`, `persona_facial_hair`, or `persona_capes`.

Fix: change the piece to a submittable piece type, or remove it from the pack.
