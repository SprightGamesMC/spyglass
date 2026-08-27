# ADDON

An addon as a whole: that it contains exactly one behavior pack and one resource pack that depend on each other, that folders and identifiers inside the packs are namespaced so they cannot repeat names used by other packs, and that the content stays within size, file count, and texture limits. Rules about the submission zip itself are in [MARKETPLACE](marketplace.md).

Runs for: addon. Every layout.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| ADDON/101 | behavior-pack-missing | error | No valid behavior pack manifest |
| ADDON/102 | resource-pack-missing | error | No valid resource pack manifest |
| ADDON/103 | bp-to-rp-dependency-missing | error | Behavior pack does not depend on the resource pack |
| ADDON/104 | rp-to-bp-dependency-missing | error | Resource pack does not depend on the behavior pack |
| ADDON/201 | file-directly-in-type-folder | error | File directly inside a type folder |
| ADDON/202 | file-directly-in-creator-folder | error | File directly inside a creator folder that is not in `creatorshortname_projectshortname` form |
| ADDON/203 | creator-folder-name-generic | error | Creator folder name is a generic term |
| ADDON/204 | structures-folder-name-not-unique | error | structures subfolder name is not in unique form |
| ADDON/205 | identifier-form-invalid | error | Animation, controller, or geometry id has the wrong prefix form |
| ADDON/206 | identifier-not-namespaced | error | Animation, controller, or geometry id is not namespaced |
| ADDON/207 | definition-identifier-not-namespaced | error | Definition identifier is not namespaced |
| ADDON/208 | material-identifier-invalid | error | Material key is not namespaced or is generic |
| ADDON/209 | resource-pack-scope-missing | error | Resource pack manifest pack_scope is missing or not world |
| ADDON/210 | catalog-key-not-namespaced | error | Catalog key is not namespaced |
| ADDON/211 | path-not-namespaced | error | Function, loot table, trade table, texture, sound, or structure path is not under a namespaced folder |
| ADDON/212 | runtime-identifier-vanilla | error | Entity runtime_identifier starts with `minecraft:` |
| ADDON/301 | bp-to-rp-dependency-mismatch | error | Behavior pack dependency uuid is not the resource pack uuid |
| ADDON/302 | rp-to-bp-dependency-mismatch | error | Resource pack dependency uuid is not the behavior pack uuid |
| ADDON/401 | creator-folder-too-many-subfolders | error | Creator folder not in `creatorshortname_projectshortname` form has more than one subfolder |
| ADDON/402 | structures-too-many-subfolders | error | structures folder has more than one direct subfolder |
| ADDON/403 | size-over-limit | error | Content larger than 25 MB |
| ADDON/404 | file-count-over-limit | error | More than 3500 files |
| ADDON/405 | too-many-texture-handles | error | More than 800 texture handles |
| ADDON/406 | texture-total-over-base-limit | error | No subpack declares a tier and total texture memory exceeds 150 MiB |
| ADDON/601 | multiple-behavior-packs | error | More than one behavior pack manifest |
| ADDON/602 | multiple-resource-packs | error | More than one resource pack manifest |
| ADDON/603 | multiple-bp-to-rp-dependencies | error | Behavior pack has more than one pack dependency |
| ADDON/604 | multiple-rp-to-bp-dependencies | error | Resource pack has more than one dependency |
| ADDON/701 | vanilla-content-override | error | File is at the path of a vanilla file |
| ADDON/702 | ui-not-allowed | error | ui folder present |
| ADDON/703 | world-impacting-command | warning | Command changes global world state |
| ADDON/704 | vanilla-dimension-chunk-data | error | World data contains chunks for a vanilla dimension |
| ADDON/705 | catalog-vanilla-override | error | blocks.json entry overrides a vanilla block |

Namespaced means that splitting the name on underscore gives at least two tokens and the first two tokens each have 2 or more characters, as in `creatorshortname_projectshortname`. Unique form means two or more letters or digits, an underscore, then two or more letters or digits. The two accepted folder layouts are described in [Notes](#notes).

ADDON/202, ADDON/203, and ADDON/401 read the same type folders as ADDON/201 and skip `structures`.

For ADDON/403 and ADDON/404, content is everything at or below a folder that contains `manifest.json`, with `Marketing Art` and `Store Art` excluded.

## ADDON/101 behavior-pack-missing

The addon has no behavior pack with a valid `manifest.json`. A manifest that exists but fails to parse counts as missing.

Fix: add a behavior pack whose `manifest.json` parses and declares a `data` module, or fix the JSON errors in the existing one.

## ADDON/102 resource-pack-missing

The addon has no resource pack with a valid `manifest.json`. A manifest that exists but fails to parse counts as missing.

Fix: add a resource pack whose `manifest.json` parses and declares a `resources` module, or fix the JSON errors in the existing one.

## ADDON/103 bp-to-rp-dependency-missing

The behavior pack `manifest.json` lists no pack dependency. Script module dependencies are not counted, and exactly one other dependency is expected.

Fix: add an entry to `dependencies` with the `uuid` and `version` of the resource pack header.

## ADDON/104 rp-to-bp-dependency-missing

The resource pack `manifest.json` lists no dependency. Every dependency counts, and exactly one is expected.

Fix: add an entry to `dependencies` with the `uuid` and `version` of the behavior pack header.

## ADDON/201 file-directly-in-type-folder

A file is directly inside a type folder, meaning a first level folder of a pack. Such a file is found by its path and can be replaced by a file of the same name in another pack. Only folders where the game finds files by path are scanned. A folder whose files the game finds by the identifier inside them is not scanned.

Behavior pack folders not scanned: `texts`, `entities`, `features`, `feature_rules`, `particles`, `items`, `scripts`, `recipes`, `spawn_rules`, `animations`, `animation_controllers`, `render_controllers`, `blocks`, `biomes`, `dialogue`, `cameras`, `aim_assist`, `block_culling`, `worldgen`, `behavior_trees`, `spawn_groups`, `item_catalog`.

Resource pack folders not scanned: `texts`, `entity`, `items`, `particles`, `materials`, `blocks`, `models`, `attachables`, `render_controllers`, `animation_controllers`, `animations`, `biomes`, `fogs`, `atmospherics`, `color_grading`, `lighting`, `local_lighting`, `pbr`, `point_lights`, `shadows`, `water`, `block_culling`, `cameras`.

Catalog files allowed directly in a type folder: `functions/tick.json`, `textures/flipbook_textures.json`, `textures/item_texture.json`, `textures/item_textures.json`, `textures/terrain_texture.json`, `textures/terrain_textures.json`, `textures/texture_list.json`, `textures/textures_list.json`, `textures/blocks.json`, `textures/block.json`, `item_catalog/crafting_item_catalog.json`, `sounds/sound_definitions.json`, `sounds/sounds.json`, `sounds/music_definitions.json`.

Fix: move the file into `type/creatorshortname/projectshortname/` or `type/creatorshortname_projectshortname/`, and update any path that refers to it.

## ADDON/202 file-directly-in-creator-folder

A file is directly inside the creator folder of the nested layout. Only the nested layout is checked, so a folder in `creatorshortname_projectshortname` form is not.

Fix: move the file into a project folder under the creator folder, and update any path that refers to it.

## ADDON/203 creator-folder-name-generic

The second level folder under a type folder is a generic term rather than a creator short name. In the nested layout the whole folder name is tested. In the flat layout the part before the first underscore is tested. The generic term list contains three kinds of word: content category names such as `mobs`, `weapons`, and `props`, the folder names Minecraft uses inside a pack such as `textures`, `models`, and `functions`, and the vanilla texture category names such as `blocks`, `items`, and `entity`. Singular and plural forms are both listed. `common` is not generic, because ADDON/401 allows it beside the project folder.

Fix: rename the folder to your creator short name and update any path that refers to it.

## ADDON/204 structures-folder-name-not-unique

A subfolder directly under `structures`, in either pack, is not in unique form.

Fix: rename it to `creatorshortname_projectshortname` and update the structure references.

## ADDON/205 identifier-form-invalid

An animation, animation controller, render controller, or geometry identifier does not start with the expected prefix. Expected forms are `controller.animation.x`, `animation.x`, `controller.render.x`, and `geometry.x`. Behavior pack animations and animation controllers are checked as well as resource pack ones. Geometry entries without an identifier are not checked.

Fix: rename the identifier to start with the right prefix, and update every reference.

## ADDON/206 identifier-not-namespaced

The segment after the prefix in an animation, controller, or geometry identifier is not namespaced.

Fix: rename it so the part after the prefix starts with `creatorshortname_projectshortname_`, and update every reference.

## ADDON/207 definition-identifier-not-namespaced

The part before the colon in a definition `identifier` is not namespaced. Every definition type with an identifier field is checked: entity, item, block, recipe, attachable, particle, spawn rule, feature, feature rule, biome, client biome, fog, camera preset, block culling rule, jigsaw structure, template pool, structure set, processor list, and aim assist preset and category.

Fix: change the namespace to `creatorshortname_projectshortname` and update every reference.

## ADDON/208 material-identifier-invalid

A material key in a resource pack `materials` file is not namespaced with a third token, as in `creatorshortname_projectshortname_materialname`. A key is generic when it has fewer than 3 underscore tokens, or when its first token is in the generic term list used by ADDON/203. A key named `version` is exempt.

Fix: rename the key and update every reference.

## ADDON/209 resource-pack-scope-missing

The resource pack `manifest.json` header has `pack_scope` missing or set to a value other than `world`.

Fix: add `"pack_scope": "world"` to the `header`.

## ADDON/210 catalog-key-not-namespaced

A catalog key is not namespaced. A key may use the colon form `creatorshortname_projectshortname:name`, where the part before the colon must be namespaced, or the underscore form `creatorshortname_projectshortname_name`, where the whole key must give at least three underscore tokens with the first two of 2 or more characters. Checked keys are the entries in `sound_definitions.json`, `terrain_texture.json`, and `item_texture.json`, the atlas tiles in `flipbook_textures.json`, and the groups in `crafting_item_catalog.json`.

Fix: rename the key to one of the two namespaced forms and update every reference.

## ADDON/211 path-not-namespaced

A file under `functions`, `loot_tables`, `trading`, `trade_tables`, `textures`, `sounds`, or `structures` is not under a namespaced first level folder. Only folders are checked, since files directly in the type folder are reported by ADDON/201. The first level folder passes in either layout:

- Flat: the folder is in unique form.
- Nested: the folder is the creator short name and contains at least one subfolder. The name must not be a generic term from the ADDON/203 list. A folder that contains only files is not the nested layout, because it has no project folder. ADDON/203 and ADDON/401 check the rest of the nested layout.

The `structures` folder takes the flat layout only, because ADDON/204 requires unique form there and ADDON/402 allows a single subfolder.

Fix: move the file under `type/creatorshortname_projectshortname/` or `type/creatorshortname/projectshortname/`, and update every path that refers to it. Under `structures` use the flat form.

## ADDON/212 runtime-identifier-vanilla

A behavior pack entity has a `description.runtime_identifier` starting with `minecraft:`, matched ignoring case. For other content types the same condition is ENTITY/601, a recommendation.

Fix: remove `description.runtime_identifier` and build the behavior with components, or set a value without the `minecraft:` prefix.

## ADDON/301 bp-to-rp-dependency-mismatch

The pack dependency in the behavior pack `manifest.json` uses a uuid other than the resource pack `header.uuid`. Runs only when the behavior pack has exactly one pack dependency and the resource pack has a valid manifest.

Fix: set the dependency `uuid` to the `header.uuid` of the resource pack.

## ADDON/302 rp-to-bp-dependency-mismatch

The dependency in the resource pack `manifest.json` uses a uuid other than the behavior pack `header.uuid`. Runs only when the resource pack has exactly one dependency and the behavior pack has a valid manifest.

Fix: set the dependency `uuid` to the `header.uuid` of the behavior pack.

## ADDON/401 creator-folder-too-many-subfolders

The creator folder of the nested layout contains more than one project subfolder. A subfolder named `common` does not count. Only the nested layout is checked.

Fix: keep one project folder per creator folder, plus an optional `common` folder, and update any path that refers to the moved folders.

## ADDON/402 structures-too-many-subfolders

The `structures` folder in either pack has more than one direct subfolder. Only direct children are counted, and any nesting under the one folder is allowed.

Fix: move every structure under one `structures/creatorshortname_projectshortname/` folder and update the structure references.

## ADDON/403 size-over-limit

The uncompressed content is larger than 25 MB (25000000 bytes).

Fix: compress textures, remove unused files, and shorten sounds.

## ADDON/404 file-count-over-limit

The content contains more than 3500 files.

Fix: remove unused files or merge files.

## ADDON/405 too-many-texture-handles

The addon uses more than 800 texture handles. A handle is counted the same way as in WORLD/401.

Fix: combine textures into fewer files or remove unused ones.

## ADDON/406 texture-total-over-base-limit

No subpack declares a tier and the total texture memory is above 150 MiB (157286400 bytes). Memory is measured the same way as in [TEXTURE](texture.md#notes).

Fix: reduce texture sizes, remove unused textures, or move the high resolution textures into subpacks that declare a tier.

## ADDON/601 multiple-behavior-packs

More than one behavior pack `manifest.json` is present.

Fix: merge the behavior packs into one, or remove the extra ones.

## ADDON/602 multiple-resource-packs

More than one resource pack `manifest.json` is present.

Fix: merge the resource packs into one, or remove the extra ones.

## ADDON/603 multiple-bp-to-rp-dependencies

The behavior pack `manifest.json` has more than one dependency that is not a script module.

Fix: keep only the resource pack and the script modules in `dependencies`.

## ADDON/604 multiple-rp-to-bp-dependencies

The resource pack `manifest.json` has more than one dependency. Every dependency counts.

Fix: keep only the behavior pack in `dependencies`.

## ADDON/701 vanilla-content-override

A file sits at the path of a vanilla file, so the game loads it instead of its own. An add-on adds content and may not replace any of it. The path is compared ignoring case, against the path inside a subpack for a file under `subpacks/<folder>/`. A texture matches whatever its extension, so `textures/blocks/stone.tga` matches the vanilla `stone.png`.

Files every pack provides are allowed even though vanilla has them:

- `manifest.json`, `pack_icon.png`
- `texts/languages.json` and every `.lang` file
- the catalogs a pack extends: `sounds.json`, `blocks.json`, `biomes_client.json`, `sounds/sound_definitions.json`, `sounds/music_definitions.json`, `textures/terrain_texture.json`, `textures/item_texture.json`, `textures/flipbook_textures.json`, `textures/texture_list.json`, `textures/textures_list.json`
- the base Vibrant Visuals files `lighting/global.json`, `water/water.json`, `atmospherics/atmospherics.json`, `color_grading/color_grading.json`, and everything under `materials`, `local_lighting`, `pbr`, `point_lights`, and `shadows`
- the `ui` folder, which ADDON/702 reports as a whole

A named Vibrant Visuals file such as `lighting/desert_lighting.json` is not allowed, because it replaces the look of a vanilla biome. An entry inside an allowed catalog that names a vanilla id is a different rule: see ADDON/207, ADDON/210, and ADDON/212.

Fix: remove the file, or move your content to a path of your own under a namespaced folder.

## ADDON/702 ui-not-allowed

A `ui` folder is directly under the resource pack.

Fix: remove the `ui` folder.

## ADDON/703 world-impacting-command

A command that changes global world state is used in a `.mcfunction` file, a dialogue file, or an animation event list. Blocked commands: `allowlist`, `alwaysday`, `changesetting`, `connect`, `daylock`, `deop`, `difficulty`, `gamemode`, `gamerule`, `gametest`, `help`, `kick`, `list`, `locate`, `op`, `ops`, `permission`, `project`, `reload`, `reloadconfig`, `save`, `script`, `setmaxplayers`, `setworldspawn`, `simulationtype`, `stop`, `tickingarea`, `time`, `transfer`, `wsserver`, `whitelist`, `?`.

Fix: remove the command, or replace it with one that only affects the addon content.

## ADDON/704 vanilla-dimension-chunk-data

World data included with the addon contains chunks for a vanilla dimension. Every dimension id below `1000` is vanilla, including `0` for the Overworld, `1` for the Nether, and `2` for The End.

Fix: remove the vanilla dimension chunk data, keeping only chunks for custom dimensions.

## ADDON/705 catalog-vanilla-override

A top level key in `blocks.json` names a vanilla block, so the entry replaces the textures or sounds of that block. A key is a vanilla block when it matches a vanilla `blocks.json` key, with or without the `minecraft:` prefix. A key that matches a block defined in the behavior pack is not reported. For other content types the same condition is BLOCK/601, a recommendation.

Entries in `sound_definitions.json`, `terrain_texture.json`, `item_texture.json`, and `flipbook_textures.json` are covered by ADDON/210 instead: a vanilla id is never namespaced, so ADDON/210 already reports it as an error.

Fix: remove the entry, or rename it to your own namespaced block identifier and define that block.

## Notes

Two folder layouts are accepted under each type folder. Nested: `type/creatorshortname/projectshortname/files`. Flat: `type/creatorshortname_projectshortname/files`, where the folder name is in unique form.

A subpack folder under `subpacks/` is treated as a pack of its own, so its first level folders are type folders and the same layout rules apply inside it. The `subpacks` folder itself is not a type folder and its subpack folders are not creator folders. This applies to ADDON/201, ADDON/202, ADDON/203, ADDON/211, and ADDON/401.

ADDON/202 and ADDON/401 apply only to the nested layout. ADDON/203 applies to the second level folder in both layouts, using the part before the first underscore in the flat layout. ADDON/211 accepts both layouts, except under `structures`, where ADDON/204 and ADDON/402 require the flat layout.
