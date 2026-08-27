# TEXTURE

The image files in each resource pack, the entries in `texture_list.json`, `terrain_texture.json`, `item_texture.json`, and `texture_set.json`, and the total texture memory a pack and its subpacks need on a device.

Runs for: addon, world, skin, texture.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| TEXTURE/201 | image-unreadable | warning | Image metadata cannot be read |
| TEXTURE/202 | tiering-invalid | error | A lower subpack tier needs more texture memory than a higher tier |
| TEXTURE/203 | tiering-invalid-for-vibrant-visuals | error | Pack supports Vibrant Visuals but exceeds the tier 2 texture memory limit |
| TEXTURE/301 | not-in-texture-list | error | Texture missing from texture_list.json |
| TEXTURE/302 | texture-set-in-texture-list | warning | Texture set image listed in texture_list.json |
| TEXTURE/303 | base-content-unused-in-lower-tiers | warning | Lowest subpack tier overrides 80 percent or more of base pack textures |
| TEXTURE/304 | texture-without-texture-set | warning | Pack has pbr capability and a texture has no texture set |
| TEXTURE/305 | texture-set-layer-not-found | error | texture_set.json refers to a layer file that does not exist |
| TEXTURE/401 | non-atlas-texture-over-recommended | warning | Single non atlas texture larger than 16 MiB |
| TEXTURE/402 | atlas-texture-over-recommended | warning | Single atlas texture larger than 256 KiB |
| TEXTURE/403 | mip-over-recommended | warning | Single texture larger than 4 MiB at highest mip |
| TEXTURE/404 | atlas-total-over-recommended | warning | Atlas total larger than 64 MiB |
| TEXTURE/405 | atlas-total-over-limit | error | Atlas total larger than 256 MiB |
| TEXTURE/406 | tier-total-over-recommended | warning | Total texture memory over the limit for the tier |
| TEXTURE/407 | targeted-tier-over-limit | error | A subpack declares a tier and total texture memory exceeds that tier limit |
| TEXTURE/408 | total-over-absolute-limit | error | Total texture memory over the tier 5 limit |
| TEXTURE/501 | deprecated-texture | warning | Uses a deprecated vanilla texture file or entry |
| TEXTURE/601 | mer-textures-in-low-tier | error | A subpack at tier 1 or lower includes MER textures |

Terms used by the memory checks are defined in [Notes](#notes): texture memory, atlas texture, subpack tier, and the tier limits.

## TEXTURE/201 image-unreadable

An image file has metadata such as width and height that cannot be read.

Fix: save the image again as a valid file of its type, or replace a file that is not a real image despite its extension.

## TEXTURE/202 tiering-invalid

Each tier a subpack targets is compared with every lower tier. A tier that no subpack targets takes the largest total of the tiers below it. A lower tier that needs more texture memory than a targeted higher tier is reported.

Fix: reduce the texture sizes in the lower tier subpack, or move larger textures into the higher tier subpack.

## TEXTURE/203 tiering-invalid-for-vibrant-visuals

A pack that declares the `pbr` capability supports Vibrant Visuals and must fit within the tier 2 texture memory limit. Total texture memory above that limit is reported.

Fix: reduce total texture memory to the tier 2 limit, or remove the `pbr` capability.

## TEXTURE/301 not-in-texture-list

The pack has a `texture_list.json` and an image under `textures` is not listed in it. A subpack has its own scope: a texture under `subpacks/<folder>/textures` passes when it is listed in a texture list of that subpack or in one at the pack root, while a texture at the pack root must be listed at the pack root. A scope with no list of its own and no list at the pack root is skipped, so a pack with no texture list at all is not checked. Images outside `textures`, such as font glyphs, are not checked. Companion images are exempt: an image declared as a `metalness_emissive_roughness`, `metalness_emissive_roughness_subsurface`, `normal`, or `heightmap` layer in a `texture_set.json`, or an image whose name ends with `_mer`, `_mers`, `_normal`, or `_heightmap`. Paths are compared in lower case, with forward slashes, and without the file extension.

Fix: add the texture path to `texture_list.json`, or remove the unused file.

## TEXTURE/302 texture-set-in-texture-list

`texture_list.json` lists a texture set companion image, meaning a MER, MERS, normal, or heightmap image declared in a `texture_set.json`.

Fix: remove the companion image entries, keeping only base color textures.

## TEXTURE/303 base-content-unused-in-lower-tiers

The lowest subpack tier is 2 or higher and that subpack overrides 80 percent or more of the base pack textures, so the base pack content is mostly unused.

Fix: move the shared textures into the base pack and keep only the textures that differ in the subpack, or add a lower tier subpack that uses the base pack textures.

## TEXTURE/304 texture-without-texture-set

The pack declares the `pbr` capability and a block or entity texture has no matching texture set. Companion files are exempt: a texture a texture set lists as a layer other than `color`, or a name ending in `_mer`, `_mers`, `_normal`, or `_heightmap`. Other texture kinds are not checked.

Fix: add a `texture_set.json` next to the texture with at least a `color` layer, or remove the `pbr` capability.

## TEXTURE/305 texture-set-layer-not-found

A layer in a `texture_set.json` refers to a file that does not exist in the pack. The layers checked are `color`, `metalness_emissive_roughness`, `metalness_emissive_roughness_subsurface`, `normal`, and `heightmap`. A layer may hold a color instead of a file name, written as an array of numbers or as a string starting with `#`. A color is not a file reference and is not checked.

Fix: add the image file, or correct the layer value.

## TEXTURE/401 non-atlas-texture-over-recommended

A single non atlas texture is larger than 16 MiB.

Fix: reduce the width or height of the texture, or split it where the model allows it.

## TEXTURE/402 atlas-texture-over-recommended

A single atlas texture is larger than 256 KiB. A 256 by 256 texture is the largest that fits.

Fix: reduce the resolution of the block or item texture.

## TEXTURE/403 mip-over-recommended

A single texture is larger than 4 MiB at its highest mip level.

Fix: reduce the width or height of the texture.

## TEXTURE/404 atlas-total-over-recommended

The atlas total is larger than 64 MiB. A total above 256 MiB is reported by TEXTURE/405 instead.

Fix: reduce the resolution of block and item textures, or remove unused ones.

## TEXTURE/405 atlas-total-over-limit

The atlas total is larger than 256 MiB. The pack cannot be published above this limit.

Fix: reduce the resolution of block and item textures, or remove unused ones.

## TEXTURE/406 tier-total-over-recommended

The total texture memory of a pack or subpack is above the limit for its tier. TEXTURE/407 uses the same limits and adds an error when the subpack declares that tier, so such a subpack gets both findings.

Fix: reduce texture resolution or remove unused textures, or raise the `memory_tier` of the subpack when the higher tier is intended.

## TEXTURE/407 targeted-tier-over-limit

A subpack declares a tier and its total texture memory is above the limit for that tier.

Fix: reduce texture resolution or remove unused textures in the subpack, or raise its `memory_tier` value.

## TEXTURE/408 total-over-absolute-limit

The total texture memory is above the tier 5 limit for the content type. No tier allows more.

Fix: reduce texture resolution or remove unused textures.

## TEXTURE/501 deprecated-texture

A vanilla texture file or atlas entry that the game replaced and no longer loads. A pack file or entry under one of these names has no effect. Reported files under `textures/blocks`: `smithing_table_top`, `smithing_table_side1`, `smithing_table_side2`, `fletcher_table_top`, `fletcher_table_side1`, `fletcher_table_side2`. Reported entries in `terrain_texture.json`: `smithing_table_top`, `smithing_table_side_a`, `smithing_table_side_b`, `fletching_table_top`, `fletching_table_side1`, `fletching_table_side2`.

Fix: rename the files and entries to the current vanilla names and update `terrain_texture.json` to match.

## TEXTURE/601 mer-textures-in-low-tier

The base pack or a subpack at tier 0 or 1 contains MER textures. The game loads the union of the base pack and the low tier subpack, so neither may contain them. MER textures are found from the layers in `texture_set.json` first, then from file names ending in `_mer` or `_mers`.

Fix: move MER textures and their `texture_set.json` layers into a subpack at tier 2 or higher.

## Notes

Texture memory is width times height times 4 bytes, uncompressed. `.hdr` files are skipped by every memory check.

Atlas textures are those under `textures/blocks` or `textures/items`, or referenced from `terrain_texture.json` or `item_texture.json`. Every other texture is a non atlas texture. The atlas total is the sum of all atlas texture memory, rounded up to the next power of two.

The tier of a subpack comes from `memory_performance_tier` when that field is a number from 0 to 5. Otherwise `memory_tier` is mapped to a tier: 10 or less is tier 0, 11 is tier 1, 12 is tier 2, 13 to 18 is tier 3, 19 to 31 is tier 4, and above 31 is tier 5.

Total texture memory limits for tiers 0 to 5, in MiB:

| Content type | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| `addon` and `skin` | 150 | 150 | 225 | 300 | 600 | 800 |
| `texture` | 350 | 350 | 500 | 650 | 1250 | 1650 |
| `world` | 750 | 750 | 1000 | 1500 | 3000 | 4000 |

Vanilla texture coverage checks are in [TEXTUREPACK](texturepack.md#notes) and WORLD/702.
