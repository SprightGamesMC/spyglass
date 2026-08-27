# MANIFEST

The `manifest.json` file of every pack and the pack icon next to it: the header, modules, dependencies, capabilities, subpacks, and settings.

Runs for: addon, world, skin, texture, persona.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| MANIFEST/101 | header-field-missing | error | Required header field absent |
| MANIFEST/102 | dependency-identifier-missing | error | Dependency has neither module_name nor uuid |
| MANIFEST/103 | pbr-capability-missing | error | Pack has Vibrant Visuals files but no pbr capability |
| MANIFEST/104 | setting-field-missing | error | Setting lacks a required field |
| MANIFEST/105 | pack-icon-missing | error | No pack_icon.png |
| MANIFEST/201 | schema-invalid | error | Manifest structure does not match the manifest schema |
| MANIFEST/202 | format-version-invalid | error | format_version is not 1, 2, or 3 |
| MANIFEST/203 | uuid-invalid | error | A uuid is not valid |
| MANIFEST/204 | pack-scope-invalid | error | pack_scope is not global, world, or any |
| MANIFEST/205 | min-engine-version-too-high-for-format-1 | error | format_version 1 with min_engine_version 1.13.0 or higher |
| MANIFEST/206 | string-version-requires-format-3 | error | Version field is a string with format_version below 3 |
| MANIFEST/207 | base-game-version-not-applicable | error | base_game_version on a pack that is not a world template |
| MANIFEST/208 | lock-template-options-not-applicable | error | lock_template_options on a pack that is not a world template |
| MANIFEST/209 | module-type-invalid | error | Module type not recognized |
| MANIFEST/210 | dependency-identifier-ambiguous | error | Dependency has both module_name and uuid |
| MANIFEST/211 | module-name-not-allowed | error | Dependency module_name not allowed |
| MANIFEST/212 | version-invalid | error | Dependency version cannot be parsed |
| MANIFEST/213 | capability-invalid | error | Resource pack declares a capability other than pbr |
| MANIFEST/214 | subpacks-not-applicable | error | subpacks on a pack that is not a resource pack |
| MANIFEST/215 | setting-type-invalid | error | Setting type not recognized |
| MANIFEST/216 | setting-range-invalid | error | Slider min, max, or step inconsistent |
| MANIFEST/217 | setting-default-invalid | error | Setting default outside its range or options |
| MANIFEST/218 | setting-name-not-namespaced | error | Setting name has no `namespace:` prefix |
| MANIFEST/219 | pack-icon-invalid-image | error | pack_icon.png cannot be decoded |
| MANIFEST/220 | pack-icon-invalid-size | error | pack_icon.png not a square power of two from 2 to 256 |
| MANIFEST/301 | dependency-not-found | error | Dependency uuid does not match any pack |
| MANIFEST/401 | setting-options-too-few | error | Dropdown has fewer than 2 options |
| MANIFEST/501 | format-version-1-not-allowed | error | Behavior, resource, or world template manifest uses format_version 1 |
| MANIFEST/502 | min-engine-version-below-current | recommendation | min_engine_version below the previous release |
| MANIFEST/503 | min-engine-version-above-current | error | min_engine_version newer than current release |
| MANIFEST/504 | module-version-below-minimum | error | Script module dependency version 1.0.0 or lower |
| MANIFEST/505 | pbr-min-engine-version-too-low | error | pbr capability with min_engine_version below 1.21.120 |
| MANIFEST/506 | script-module-uuid-outdated | warning | Script module dependency declared by uuid instead of module_name |
| MANIFEST/601 | uuid-duplicate | error | Same uuid used more than once |
| MANIFEST/602 | multiple-world-template-modules | error | More than one world_template module |
| MANIFEST/603 | subpack-folder-duplicate | error | Two subpacks use the same folder_name |
| MANIFEST/604 | subpack-name-duplicate | error | Two subpacks use the same name |
| MANIFEST/605 | setting-name-duplicate | error | Two settings use the same name |
| MANIFEST/606 | setting-options-duplicate | error | Dropdown has repeated option names |
| MANIFEST/607 | multiple-pack-icons | error | More than one pack_icon file |
| MANIFEST/701 | capabilities-on-behavior-pack | warning | Behavior pack declares capabilities |

A pack icon is any file whose name contains `pack_icon` and ends with `.png`.

## MANIFEST/101 header-field-missing

A required field is absent from `header`. `description` is required for every pack except skin packs, and an empty value counts as missing. `min_engine_version` is required for every behavior pack, and for every resource pack with `format_version` 2 or higher. Fields that only a world template needs are checked by [WORLD](world.md).

Fix: add the missing field to `header`.

## MANIFEST/102 dependency-identifier-missing

An entry in `dependencies` has neither `module_name` nor `uuid`.

Fix: give the dependency a `uuid` for a pack or a `module_name` for a script module, or remove the entry.

## MANIFEST/103 pbr-capability-missing

The pack contains Vibrant Visuals files, meaning texture sets with MER, MERS, normal, or heightmap layers, but does not declare the `pbr` capability. Resource packs only.

Fix: add `"capabilities": ["pbr"]`, or remove the texture set layers.

## MANIFEST/104 setting-field-missing

An entry in `settings` lacks a field its type needs. A `toggle` needs `name` and `default`. A `slider` needs `name`, `min`, `max`, `step`, and `default`. A `dropdown` needs `name`, `default`, and `options`.

Fix: add the missing field to that setting.

## MANIFEST/105 pack-icon-missing

The pack has no pack icon. Skin, persona, and emote packs are skipped, as are world templates, which use `world_icon.jpeg` and are checked by [WORLD/102](world.md#world102-icon-missing). The finding points at the `manifest.json` of the pack.

Fix: add a `pack_icon.png` next to `manifest.json`.

## MANIFEST/201 schema-invalid

The structure of `manifest.json` does not match the manifest schema. One schema is used for every manifest. It checks that the top level keys are known, that `header` and `modules` are present, that each value has the correct type, and that arrays and objects appear where expected. Required fields, allowed values, and pack type rules are separate checks. When a file is reported here, the other checks that read the manifest skip it.

Fix: correct the structure, then run again to see the remaining checks.

## MANIFEST/202 format-version-invalid

`format_version` is missing or is not 1, 2, or 3.

Fix: set `format_version` to 2, or to 3 when using string versions.

## MANIFEST/203 uuid-invalid

A `uuid` value is not a valid UUID. The header uuid, each module uuid, and each dependency uuid are checked, and a missing header or module uuid is reported here. One finding per invalid uuid.

Fix: replace the value with a valid UUID.

## MANIFEST/204 pack-scope-invalid

The header `pack_scope` is not `global`, `world`, or `any`.

Fix: set one of the three values, or remove the field.

## MANIFEST/205 min-engine-version-too-high-for-format-1

A resource pack with `format_version` 1 declares a `min_engine_version` of 1.13.0 or higher. For Education edition the threshold is 1.15.0. Resource packs only.

Fix: raise `format_version` to 2, or lower `min_engine_version` below the threshold.

## MANIFEST/206 string-version-requires-format-3

A version field is a string while `format_version` is below 3. Applies to `header.version`, `header.min_engine_version`, `modules[].version`, and `dependencies[].version`. A dependency with `module_name` is skipped, since script module dependencies always use a string version.

Fix: change the version to an array, or raise `format_version` to 3.

## MANIFEST/207 base-game-version-not-applicable

The header has `base_game_version` but the pack is not a world template.

Fix: remove the field.

## MANIFEST/208 lock-template-options-not-applicable

The header has `lock_template_options` but the pack is not a world template.

Fix: remove the field.

## MANIFEST/209 module-type-invalid

A module `type` is missing or not one of `persona_piece`, `world_template`, `skin_pack`, `data`, `script`, `resources`. Case is ignored.

Fix: set the module `type` to a known value.

## MANIFEST/210 dependency-identifier-ambiguous

A dependency has both `module_name` and `uuid`. It must point at either a pack or a script module.

Fix: keep only `uuid` for a pack, or only `module_name` for a script module.

## MANIFEST/211 module-name-not-allowed

A dependency `module_name` is not on the allowed list. Allowed modules and their minimum versions are `@minecraft/server` 1.0.0 and `@minecraft/server-ui` 1.0.0.

Fix: change `module_name` to an allowed module, or remove the dependency.

## MANIFEST/212 version-invalid

A dependency `version` is missing or cannot be parsed.

Fix: write the version as an array, or as a valid version string when `format_version` is 3.

## MANIFEST/213 capability-invalid

A resource pack declares a capability other than `pbr`. Behavior packs that declare capabilities are reported by MANIFEST/701.

Fix: remove the unknown value from `capabilities`.

## MANIFEST/214 subpacks-not-applicable

The manifest has `subpacks` but the pack is not a resource pack.

Fix: remove `subpacks`.

## MANIFEST/215 setting-type-invalid

A setting `type` is missing or not one of `label`, `toggle`, `slider`, `dropdown`.

Fix: set the setting `type` to a known value.

## MANIFEST/216 setting-range-invalid

A slider setting has an inconsistent range. `min` must not exceed `max`, and `step` must be greater than 0 and not greater than `max` minus `min`.

Fix: adjust `min`, `max`, and `step`.

## MANIFEST/217 setting-default-invalid

A setting `default` is outside what it allows. A slider default must be a number between `min` and `max`. A dropdown default must be one of the option names.

Fix: set `default` to an allowed value.

## MANIFEST/218 setting-name-not-namespaced

A setting `name` has no `namespace:` prefix.

Fix: prefix the setting `name` with your namespace.

## MANIFEST/219 pack-icon-invalid-image

`pack_icon.png` cannot be decoded as an image.

Fix: export it again as a valid PNG.

## MANIFEST/220 pack-icon-invalid-size

`pack_icon.png` is not a square whose side is a power of two from 2 to 256.

Fix: resize the icon to an allowed square size.

## MANIFEST/301 dependency-not-found

A dependency `uuid` does not match the header uuid of any pack in the input, whatever its type. Only the dependencies of behavior packs and resource packs are checked. Dependencies by `module_name` are not checked here, nor is a uuid of a scripting API module, which is MANIFEST/506.

Fix: correct the dependency `uuid`, or include the missing pack in the project.

## MANIFEST/401 setting-options-too-few

A dropdown setting has fewer than 2 options.

Fix: give the dropdown at least 2 entries in `options`, or use another setting type.

## MANIFEST/501 format-version-1-not-allowed

A behavior pack, resource pack, or world template manifest uses `format_version` 1. Skin, persona, and emote packs are exempt, since version 1 is still valid for them.

Fix: raise `format_version` to 2 and update the header and modules to that format.

## MANIFEST/502 min-engine-version-below-current

`min_engine_version` is below the release before the current game release. Only major and minor are compared. The current release and the previous release are not reported. Minor versions that were never released are skipped when finding the previous release. Behavior and resource packs only.

Fix: raise `min_engine_version` to the current release when the pack relies on newer features.

## MANIFEST/503 min-engine-version-above-current

`min_engine_version` is newer than the current game release. Only major and minor are compared. Behavior and resource packs only.

Fix: lower `min_engine_version` to the current release or older.

## MANIFEST/504 module-version-below-minimum

A script module dependency declares a version of 1.0.0 or lower. Only dependencies with `module_name` are checked.

Fix: raise the dependency `version` above 1.0.0 to a released version of that module.

## MANIFEST/505 pbr-min-engine-version-too-low

The manifest declares the `pbr` capability but `min_engine_version` is below 1.21.120.

Fix: raise `min_engine_version` to at least `[1, 21, 120]`.

## MANIFEST/506 script-module-uuid-outdated

A dependency `uuid` matches a scripting API module. Every scripting API module has a uuid as well as a `module_name`, but the uuid form is outdated. The comparison ignores case. Such a dependency is not reported by MANIFEST/301, because the uuid names a module and not a pack. The module uuids are:

| Module | Uuid |
|---|---|
| `@minecraft/common` | `77ec12b4-1b2b-4c98-8d34-d1cd63f849d5` |
| `@minecraft/debug-utilities` | `1796ea86-0daf-4409-99ee-fd6467cf1203` |
| `@minecraft/server` | `b26a4d4c-afdf-4690-88f8-931846312678` |
| `@minecraft/server-admin` | `53d7f2bf-bf9c-49c4-ad1f-7c803d947920` |
| `@minecraft/server-editor` | `1d565354-296d-11ed-a261-0242ac120002` |
| `@minecraft/server-editor-bindings` | `8518d9c7-a1f5-4bf3-acc7-78e87df595fc` |
| `@minecraft/server-gametest` | `6f4b6893-1bb6-42fd-b458-7fa3d0c89616` |
| `@minecraft/server-net` | `777b1798-13a6-401c-9cba-0cf17e31a81b` |
| `@minecraft/server-ui` | `2bd50a27-ab5f-4f40-a596-3641627c635e` |

Fix: replace the `uuid` field with `module_name` set to the module named in the finding, keeping `version`.

## MANIFEST/601 uuid-duplicate

The same uuid is used more than once across the header, modules, and dependencies. Only uuids that passed MANIFEST/203 are compared.

Fix: generate a new UUID for each repeat. The header and every module need their own.

## MANIFEST/602 multiple-world-template-modules

The manifest has more than one module of type `world_template`. Case is ignored.

Fix: keep one and remove the others.

## MANIFEST/603 subpack-folder-duplicate

Two entries in `subpacks` use the same `folder_name`.

Fix: give each subpack a unique `folder_name`.

## MANIFEST/604 subpack-name-duplicate

Two entries in `subpacks` use the same `name`.

Fix: give each subpack a unique `name`.

## MANIFEST/605 setting-name-duplicate

Two entries in `settings` use the same `name`.

Fix: give each setting a unique `name`.

## MANIFEST/606 setting-options-duplicate

A dropdown setting has repeated option names.

Fix: remove or rename the repeats so each name appears once.

## MANIFEST/607 multiple-pack-icons

The pack has more than one pack icon file. The finding points at the `manifest.json` of the pack.

Fix: keep one `pack_icon.png` next to `manifest.json` and remove the others.

## MANIFEST/701 capabilities-on-behavior-pack

A behavior pack declares `capabilities`. This works in game but is not allowed on the Marketplace.

Fix: remove `capabilities` from the behavior pack manifest and declare them on the resource pack.
