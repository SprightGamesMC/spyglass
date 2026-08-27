# DEFINITION

Rules every JSON definition file shares: the version field, the file structure, and the identifier namespace. A definition file declares a thing the game loads by identifier or by folder. Rules for one file type only are in the group for that type: [ENTITY](entity.md), [BLOCK](block.md), [PARTICLE](particle.md).

Runs for: addon, world, texture.

Which files each check inspects:

| File type | Folder | 101 | 201 | 501 | 502 | 601 |
|---|---|---|---|---|---|---|
| Entity | `entities` in a behavior pack | yes | yes, current release only | current release | current release | yes |
| Item | `items` in a behavior pack | yes | yes, current release only | current release | current release | yes |
| Block | `blocks` in a behavior pack | yes | yes, current release only | current release | current release | yes |
| Recipe | `recipes` | yes | yes | current release | current release | yes |
| Biome, feature, feature rule | `biomes`, `features`, `feature_rules` in a behavior pack | yes | yes | current release | current release | yes |
| Client biome | `biomes` in a resource pack | yes | yes | current release | current release | no |
| Fog | `fogs` | yes | yes | vanilla data | vanilla data | no |
| Spawn rule | `spawn_rules` | yes | yes | vanilla data | vanilla data | yes |
| Render controller | `render_controllers` | yes | no | vanilla data | vanilla data | no |
| Texture set | `*.texture_set.json` under `textures` | yes | no | vanilla data | vanilla data | no |
| Animation, animation controller | `animations`, `animation_controllers` in either pack | yes | no | exact `1.10.0` | exact `1.10.0` | no |
| Attachable | `attachables` | yes | no | at least `1.10.0` | current release | no |
| Entity | `entity` in a resource pack | yes | no | at least `1.10.0` | current release | no |
| Particle | `particles` | yes | no | at least `1.10.0` | current release | no |
| Geometry | `models` | yes | no | at least `1.8.0` | current release | no |

The expected version column has four sources.

- Current release is the game version the run was given. These formats gain a new version with the game, so the newest release version is always valid.
- Vanilla data is the highest `format_version` the released Minecraft files use for that file type, read from the vanilla data included with the tool. These formats change at different times, so the current release is usually a version the game cannot load.
- Exact means one fixed version, both below and above.
- At least means only a lowest version is set. Any version up to the current release is allowed.

Recipe references to blocks resolve through item identifiers, so a block identifier is registered as an item link.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| DEFINITION/101 | format-version-missing | error | Definition has no parseable format_version |
| DEFINITION/201 | schema-invalid | warning | Definition does not match schema |
| DEFINITION/501 | format-version-below-expected | recommendation | format_version older than expected |
| DEFINITION/502 | format-version-above-expected | error | format_version newer than expected |
| DEFINITION/601 | minecraft-identifier | recommendation | Identifier starts with `minecraft:` |

## DEFINITION/101 format-version-missing

The file has no `format_version` field, or the value cannot be read as a version. A value that cannot be read is reported as `format_version <value> is not a version`.

Fix: add a `format_version` at the top level, using the expected version the table gives for that file type.

## DEFINITION/201 schema-invalid

The file does not match the schema for its type. Entity, item, and block files are compared only when the `format_version` major and minor numbers equal the current release, because their formats change with the game. Recipes, spawn rules, fog, biomes, client biomes, features, and feature rules are always compared. Errors are grouped by kind, and each kind produces one finding:

- missing required field
- wrong value type
- value not in the allowed list
- unknown definition type
- other structure issue

Unknown definition type means the file has none of the root keys the schema knows. When that happens no other issue is reported for that file.

Fix: add missing required fields, correct value types, replace values that are not in the allowed list, and remove keys the format does not define. For an unknown definition type, check the spelling of the root key.

## DEFINITION/501 format-version-below-expected

The `format_version` is older than the expected version for the file type. Two comparison rules exist.

Release rules apply where the expected version is the current release or a version read from vanilla data. The version counts as older when the major number is lower, when the minor number is below the expected minor minus 1, or when the patch number is lower. The previous minor is allowed.

Exact rules apply where the expected version is fixed, and where the file type has a lowest version only. Any version lower than the expected version is reported.

Fix: set `format_version` to the expected version and update any fields that changed in that format.

## DEFINITION/502 format-version-above-expected

The `format_version` is newer than the expected version for the file type. File types with a lowest version only are compared against the current release.

Release rules apply where the expected version is the current release or a version read from vanilla data. The version counts as newer when the major or minor number is higher. A higher patch number counts only when the minor number equals the expected minor.

Exact rules apply where the expected version is fixed. Any higher version is reported.

Fix: set `format_version` to the expected version or an older one. A version the game does not know cannot be loaded.

## DEFINITION/601 minecraft-identifier

The `identifier` under `description` of a behavior pack definition starts with `minecraft:`, matched ignoring case. The field is read as `<root key>.description.identifier`, so every recipe and feature root key is included. Resource pack files such as client entities, attachables, particles, fog, and client biomes are not checked, because a `minecraft:` identifier there is how vanilla visuals are overridden. Does not run for the addon content type, where ADDON/207 reports the same condition as an error.

Fix: change `description.identifier` to your own namespace, then update every reference to the old identifier in recipes, loot tables, scripts, and language files.
