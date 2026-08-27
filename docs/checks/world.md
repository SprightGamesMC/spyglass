# WORLD

A world template as a whole: the `level.dat` save data, the `world_icon.jpeg` preview image, the template `manifest.json`, and the `world_behavior_packs.json` and `world_resource_packs.json` pack reference files.

Runs for: world.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| WORLD/101 | level-dat-missing | warning | World has no readable level.dat |
| WORLD/102 | icon-missing | error | No world_icon.jpeg |
| WORLD/103 | base-game-version-missing | error | World template header has no base_game_version |
| WORLD/104 | lock-template-options-missing | error | World template header has no lock_template_options |
| WORLD/105 | levelname-missing | error | World has no levelname.txt |
| WORLD/106 | database-missing | error | World has no db folder files |
| WORLD/201 | icon-invalid-image | error | world_icon.jpeg cannot be decoded |
| WORLD/202 | icon-invalid-size | error | world_icon.jpeg is not 800 by 450 |
| WORLD/203 | pack-references-invalid | error | Pack references file is not an array of objects |
| WORLD/204 | pack-reference-id-invalid | error | pack_id missing or not a valid uuid |
| WORLD/205 | pack-reference-version-invalid | error | Pack reference version missing or malformed |
| WORLD/206 | base-game-version-wildcard | warning | base_game_version is `*` |
| WORLD/301 | pack-reference-not-found | error | pack_id does not match any pack |
| WORLD/401 | too-many-texture-handles | error | More than 3000 texture handles |
| WORLD/501 | base-game-version-below-current | recommendation | base_game_version older than current release |
| WORLD/502 | base-game-version-above-current | error | base_game_version newer than current release |
| WORLD/601 | multiple-icons | error | More than one world_icon.jpeg |
| WORLD/701 | experiment-enabled | warning | An experiment is or was enabled |
| WORLD/702 | mashup-coverage-low | error | Global resource pack overrides under 60 percent of vanilla textures |

WORLD/103, WORLD/104, WORLD/206, WORLD/501, and WORLD/502 apply only to world templates.

## WORLD/101 level-dat-missing

The world folder has no `level.dat` or `level.dat_old`, reported on the world folder. Also reported on the file when `level.dat` exists but cannot be parsed as NBT.

Fix: export the world again from the game so `level.dat` is present at the world folder root.

## WORLD/102 icon-missing

A world template folder has no icon. An icon is any file whose name contains `world_icon` and ends with `.jpeg`. Each template folder is checked separately.

Fix: add a `world_icon.jpeg` of 800 by 450 pixels at the template root.

## WORLD/103 base-game-version-missing

The `header` in the world template `manifest.json` has no `base_game_version`.

Fix: add `base_game_version` set to the game version the world was built for.

## WORLD/104 lock-template-options-missing

The `header` in the world template `manifest.json` has no `lock_template_options`. Only checked when `format_version` is 2 or higher.

Fix: add `lock_template_options` set to `true` or `false`.

## WORLD/105 levelname-missing

The world folder has no `levelname.txt`, the file that holds the world name.

Fix: export the world again from the game, or add `levelname.txt` with the world name.

## WORLD/106 database-missing

The world folder has no files in its `db` folder, so the world has no saved chunk data and is incomplete.

Fix: export the world again from the game so the `db` folder is written with the world.

## WORLD/201 icon-invalid-image

`world_icon.jpeg` exists but cannot be decoded as an image.

Fix: export the icon again as a valid JPEG.

## WORLD/202 icon-invalid-size

`world_icon.jpeg` is not 800 by 450 pixels. Education projects also allow 480 by 270. A project counts as Education when it contains an education JSON item.

Fix: resize the icon to an allowed size.

## WORLD/203 pack-references-invalid

`world_behavior_packs.json` or `world_resource_packs.json` is not a JSON array of objects. One finding when the file is not an array, and one for each entry that is not an object.

Fix: make the top level a JSON array whose entries are objects with `pack_id` and `version`.

## WORLD/204 pack-reference-id-invalid

A pack reference entry has no `pack_id`, or the value is not a valid UUID.

Fix: set `pack_id` to the `header.uuid` of the pack it refers to.

## WORLD/205 pack-reference-version-invalid

A pack reference entry has no `version`, or the value is malformed. The version must be an array of three numbers or a valid version string.

Fix: set `version` to match the `header.version` of the referenced pack.

## WORLD/206 base-game-version-wildcard

`base_game_version` in the world template `manifest.json` is `*`.

Fix: replace it with the game version the world was built for.

## WORLD/301 pack-reference-not-found

A `pack_id` in a pack reference file does not match the `header.uuid` of any resource pack or behavior pack manifest in the project.

Fix: correct the `pack_id`, or add the missing pack to the project.

## WORLD/401 too-many-texture-handles

The world references more than 3000 texture handles. A handle is one distinct non atlas texture the pack references. Entity, attachable, particle, UI, and flipbook textures count. Block and item textures do not, because they share an atlas. Vanilla texture paths do not count. Resource packs nested inside the world always count. Resource packs outside the world count only when the input contains exactly one world.

Fix: combine or remove textures until 3000 or fewer remain.

## WORLD/501 base-game-version-below-current

`base_game_version` is older than the current game release. Reported when the major number is lower, when the minor number is too old under the same skipped range rule as MANIFEST/502, or when the patch number is lower.

Fix: update `base_game_version` to the current release and test the world on it.

## WORLD/502 base-game-version-above-current

`base_game_version` is newer than the current game release. Reported when the major or minor number is higher. A higher patch number is reported only when the minor number equals the current one.

Fix: set `base_game_version` to the current release or older.

## WORLD/601 multiple-icons

A world template folder has more than one file whose name contains `world_icon` and ends with `.jpeg`. Each template folder is checked separately.

Fix: keep one `world_icon.jpeg` and remove the others.

## WORLD/701 experiment-enabled

An experiment is enabled, or was enabled at some point. Values are read from `level.dat` or `level.dat_old`. Reported are the top level `experimentalgameplay` flag when true, and inside the `experiments` compound `experiments_ever_used` and any other flag that is true. The key `saved_with_toggled_experiments` is ignored. The message lists every reported key.

Fix: create a new world with no experiments turned on and move the content into it. Once an experiment has been used, the flag stays in the save data even after it is turned off.

## WORLD/702 mashup-coverage-low

A mashup is a world published with a resource pack outside the world template folder. That global resource pack overrides under 60 percent of vanilla textures. Coverage counts only vanilla textures under `textures/blocks`, `textures/entity`, and `textures/items`. Names ending with `_mer`, `_mers`, `_normal`, `_heightmap`, or `_mipmap` followed by an optional number are excluded, as are the folders and files in the vanilla texture exemption list. See [TEXTUREPACK](texturepack.md#notes).

Fix: add overrides for more vanilla block, entity, and item textures until at least 60 percent are covered.
