# PACK

The pack as a whole: the manifest, which files are allowed inside, where files are placed, cross references between definitions and assets, size limits, and copies of vanilla files.

Runs for: addon, world, skin, texture, persona.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| PACK/101 | manifest-missing | error | Pack folder has no manifest.json |
| PACK/201 | extension-not-allowed | error | File extension not allowed for the pack type |
| PACK/202 | unknown-json | error | JSON file in a location the tool cannot classify |
| PACK/203 | file-name-blocked | error | File name is reserved by the game |
| PACK/204 | file-outside-pack | error | File or folder not inside any pack |
| PACK/301 | asset-unused | warning | Texture or sound file not referenced by anything |
| PACK/302 | link-not-found | warning | Definition references an id that does not exist |
| PACK/303 | links-to-vanilla | recommendation | Definition references a vanilla id |
| PACK/401 | size-over-limit | error | Content larger than 250 MB |
| PACK/402 | file-count-over-limit | warning | More than 10000 files |
| PACK/601 | multiple-manifests | error | More than one manifest.json inside one pack |
| PACK/602 | overrides-protected-vanilla-asset | error | File path matches a protected vanilla path |
| PACK/603 | vanilla-copy | recommendation | File is a full or partial copy of a vanilla file |
| PACK/701 | experimental-type-not-allowed | error | File is an experimental definition type |

## PACK/101 manifest-missing

A pack folder has no `manifest.json` at its root. A pack folder is a folder directly inside `behavior_packs`, `resource_packs`, or `skin_packs`, or a folder named `skin_pack`, `persona`, or `world_template`. When the content contains no pack and no world at all, one finding with the message `No manifest.json found anywhere in the content` and no path is reported instead.

Fix: add a `manifest.json` at the pack root with a `header` and at least one `modules` entry.

## PACK/201 extension-not-allowed

A file extension is not allowed for its pack type:

- Behavior pack and resource pack: `json`, `txt`, `lang`, `material`, `mcfunction`, `nbt`, `png`, `tga`, `jpg`, `jpeg`, `hdr`, `wav`, `ogg`, `fsb`, `mcstructure`. Behavior packs also allow `js` and `ts`.
- Skin pack: `json`, `lang`, `png`, `tga`, `jpg`, `jpeg`.
- Persona and emote packs: `json`, `lang`, `png`, `tga`.
- World templates have no restriction.

Fix: remove the file from the pack or convert it to an allowed format. Working files such as source images or editor project files stay outside the pack.

## PACK/202 unknown-json

A `.json` file is in a location that maps to no known Bedrock file type. A file under `subpacks/<folder>/` is classified by its path inside the subpack, because a subpack has the same structure as the pack it is part of. Classification is by folder and file name, so a definition in a misspelled folder or under an unexpected file name is reported. The Vibrant Visuals folders `atmospherics`, `color_grading`, `lighting`, `local_lighting`, `pbr`, `point_lights`, `shadows`, and `water` are known resource pack types. Both `texture_list.json` and `textures_list.json` are accepted. Every `.json` file under `textures/ui/` is a UI file. The resource pack root files `splashes.json` and `loading_messages.json` are the title screen text lists and are known file types.

Fix: move or rename the file to what the game expects for that file type, or remove it from the pack.

## PACK/203 file-name-blocked

A file uses a name or path the game or the store reserves:

- Behavior pack and resource pack: `font/emoticons.json`, `credits/end.txt`, `items_client.json`, `items_offsets_clients.json`, `texts/languages_names.json`, the `shaders` folder at the root, `ui/mcoin.png`, `contents.json`, and `signatures.json`.
- Skin pack and world template: `ui/mcoin.png` and `contents.json` at the root.
- Persona and emote packs: no blocked names. `contents.json` and `signatures.json` at the root are added by the store.

Names are matched ignoring case, against the path inside a subpack for a file under `subpacks/<folder>/`. A name with no folder is matched by file name at any depth inside the pack. A name with a folder is matched at that exact path.

Fix: remove the file, or move its content to a name and location that is not reserved.

An add-on may not contain any file at a vanilla path, `splashes.json` and `loading_messages.json` included. That rule is ADDON/701, because other content types may contain such files.

## PACK/204 file-outside-pack

A file or folder has no `manifest.json` at or above it. At most 5 findings are reported per run.

Fix: move the file into its pack or remove it. If a whole folder is reported, check that its pack has a `manifest.json` at the right level.

## PACK/301 asset-unused

A texture or audio file is not referenced by any definition in the content. Only textures under `textures/` and audio under `sounds/` inside resource packs are checked. A file under `subpacks/<folder>/` is measured by its path inside the subpack, so a subpack texture counts as referenced when a definition names the path it provides. Images in other folders such as `font/` are found by the game by path and are not reported.

UI files can build texture paths from expressions. Every quoted literal starting with `textures/` inside such an expression is treated as a path prefix, and every texture under that prefix counts as referenced.

Exempt files:

- A file whose pack relative path matches a vanilla path, because the game references it. For textures the match ignores the file extension. For sounds the path without the file extension is also compared to the file paths listed in the vanilla `sound_definitions.json`, because the game includes some sound files that the samples repository does not have.
- A file under a folder the game reads by path that is not in the vanilla samples. These are listed in `src/Data/VanillaEnginePaths.ts`.
- Texture set companion files whose name ends in `_mer`, `_mers`, `_normal`, or `_heightmap`.

Fix: reference the file from a definition such as a texture map, sound definition, or client entity, or remove it.

## PACK/302 link-not-found

A definition references an id that does not exist in the content or in vanilla. One finding per missing reference. A texture or sound inside `subpacks/<folder>/` is registered under its path inside the subpack, because a subpack provides that path to the pack it is part of. Link kinds are geometry, texture, animation, animation alias, sound, and entity references.

Animation controller states reference aliases, which are the keys of the `animations` map in an entity, client entity, or attachable, not global animation ids. Sound event names resolve against the vanilla `sound_definitions.json` list. A sound file reference resolves against vanilla when a vanilla sound file has that path, or when the vanilla `sound_definitions.json` lists that path. Texture and sound references are compared in lower case, with forward slashes, and without the file extension. Only a known image or sound extension is removed, so a name that contains a dot keeps it. Two texture values are not file references and are not reported: a particle texture named `atlas.` followed by an atlas name, such as `atlas.terrain`, `atlas.items`, or `atlas.shield`, which the game builds itself, and a `texture_set.json` layer holding a color, written as an array of numbers or as a string starting with `#`.

Fix: correct the id or add the missing definition. For animation controller states, check that the alias is listed in the `animations` map of the entity, client entity, or attachable that uses the controller.

## PACK/303 links-to-vanilla

A definition references a vanilla id, such as a geometry, texture, animation, or sound. Skipped for the texture content type, where linking to vanilla is expected.

Fix: include your own copy of the asset under your own namespaced id and reference that instead.

## PACK/401 size-over-limit

The content is larger than 250 MB. Content size is everything at or below a folder that contains `manifest.json`. Files outside packs do not count.

Fix: compress textures and audio, remove unused files, and lower texture resolution where it is not needed.

## PACK/402 file-count-over-limit

The content has more than 10000 files. Files inside archives are counted too. Folders deeper than 15 levels are not traversed and their files are not counted.

Fix: remove unused files and merge small files where the format allows it, such as combining textures into atlases.

## PACK/601 multiple-manifests

More than one `manifest.json` is inside one pack, which makes the pack boundary unclear.

Fix: keep one `manifest.json` at the pack root. If the nested manifest is for a separate pack, move that pack to its own folder next to the first one.

## PACK/602 overrides-protected-vanilla-asset

A file path matches a protected vanilla path. There is currently one, the behavior pack folder `structures/sulfur_spring`. Applies to every content type.

Fix: rename or move the file so it is not on the protected path.

## PACK/603 vanilla-copy

A file is a full or partial copy of a vanilla file. A file under `subpacks/<folder>/` is compared against the vanilla path it provides. Full copies are found by comparing the file hash against a table of vanilla hashes, with `texts/languages.json` exempt because it is always identical. Partial copies are detected per top level property, only for `.json` and `.material` files under `ui` or `materials`, or named `mobs.json`, `sound_definitions.json`, `item_texture.json`, `terrain_texture.json`, or `blocks.json`. Header properties that every pack writes the same way are exempt: `format_version`, `namespace`, `resource_pack_name`, `texture_name`, `padding`, and `num_mip_levels`. Skipped for the texture content type, where copying vanilla is expected, and for the addon content type, where ADDON/701 reports every file at a vanilla path as an error.

Fix: remove the copied file or the copied properties, keeping only the parts the pack changes.

## PACK/701 experimental-type-not-allowed

A file is an experimental definition type: aim assist preset, aim assist category, behavior tree, or spawn group. Jigsaw types are no longer experimental and are not reported.

Fix: remove the file. Experimental features cannot be included in published content.
