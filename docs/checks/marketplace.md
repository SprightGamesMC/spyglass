# MARKETPLACE

The folder structure of a submission zip and the consistency between the packs inside it: the `Content` folder at the root, and the manifests and pack reference files under it. Art files are checked by [ART](art.md).

Runs for: addon, world, skin, texture, persona. Marketplace layout only.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| MARKETPLACE/101 | content-folder-missing | error | No Content folder at the root |
| MARKETPLACE/102 | world-template-missing | error | No Content/world_template folder |
| MARKETPLACE/103 | skin-pack-folder-missing | error | No Content/skin_pack folder |
| MARKETPLACE/104 | resource-pack-folder-missing | error | No Content/resource_packs folder |
| MARKETPLACE/105 | persona-folder-missing | error | No Content/persona folder |
| MARKETPLACE/106 | world-pack-reference-file-missing | error | World template has a pack but no matching pack reference file |
| MARKETPLACE/107 | product-type-missing | error | metadata.product_type is missing or not addon |
| MARKETPLACE/201 | pack-folder-name-invalid | error | Pack folder name is not BP_ or RP_ followed by the acronym |
| MARKETPLACE/202 | pack-folder-acronym-mismatch | error | Behavior pack and resource pack folders use different acronyms |
| MARKETPLACE/203 | manifest-file-name-case | error | Manifest file name is not exactly manifest.json |
| MARKETPLACE/204 | behavior-pack-has-pack-scope | error | Add-on behavior pack manifest declares pack_scope |
| MARKETPLACE/205 | world-resource-pack-in-both-locations | error | World has a resource pack under both Content/resource_packs and Content/world_template/resource_packs |
| MARKETPLACE/206 | pack-versions-differ | error | Pack manifests in one submission have different header versions |
| MARKETPLACE/207 | min-engine-versions-differ | error | Pack manifests in one submission have different min_engine_version values |
| MARKETPLACE/208 | world-pack-reference-mismatch | error | Pack reference version does not match the pack manifest version |
| MARKETPLACE/209 | pack-folder-count-invalid | error | More than one pack folder under behavior_packs or resource_packs |
| MARKETPLACE/301 | pack-not-referenced | error | Pack inside a world template is not listed in its pack reference file |
| MARKETPLACE/701 | archive-folder-not-allowed | error | __brarchive folder inside the submission |

For MARKETPLACE/101 to MARKETPLACE/105, a folder whose name matches only when case is ignored is reported with the name that was found.

## MARKETPLACE/101 content-folder-missing

The submission root has no `Content` folder. All packs are under it. `Marketing Art` and `Store Art` are next to it at the root.

Fix: create `Content` at the root and move the pack folders into it.

## MARKETPLACE/102 world-template-missing

A world submission has no `Content/world_template` folder. World content type only.

Fix: place the world template in `Content/world_template`.

## MARKETPLACE/103 skin-pack-folder-missing

A skin pack submission has no `Content/skin_pack` folder. Skin pack content type only.

Fix: place the skin pack in `Content/skin_pack`.

## MARKETPLACE/104 resource-pack-folder-missing

A texture pack submission has no `Content/resource_packs` folder. Texture pack content type only.

Fix: place the resource pack in `Content/resource_packs/RP_Acronym`.

## MARKETPLACE/105 persona-folder-missing

A persona piece or emote submission has no `Content/persona` folder. Persona content type only.

Fix: place the persona package in `Content/persona`.

## MARKETPLACE/106 world-pack-reference-file-missing

A world template contains a pack with no matching pack reference file at the `world_template` root. A behavior pack under `world_template/behavior_packs` needs `world_behavior_packs.json`, a resource pack under `world_template/resource_packs` needs `world_resource_packs.json`. World content type only.

Fix: add the file and list each pack in it by `pack_id` and `version`.

## MARKETPLACE/107 product-type-missing

An add-on manifest has `metadata.product_type` missing or set to a value other than `addon`. Add-on content type only.

Fix: set `"product_type": "addon"` under `metadata`.

## MARKETPLACE/201 pack-folder-name-invalid

A pack folder is not named `BP_` or `RP_` followed by the acronym. Acronym characters are letters, digits, underscore, and hyphen. A pack in the wrong folder or with the wrong name is still found and its name reported. The number of pack folders is checked by MARKETPLACE/209.

Fix: rename the folders to `BP_Acronym` and `RP_Acronym`.

## MARKETPLACE/202 pack-folder-acronym-mismatch

The behavior pack folder and resource pack folder use different acronyms after the `BP_` and `RP_` prefixes.

Fix: rename the folders so both use the same acronym.

## MARKETPLACE/203 manifest-file-name-case

The manifest file name is not exactly `manifest.json`. Such a file is reported here and not as a missing manifest.

Fix: rename the file to lower case `manifest.json`.

## MARKETPLACE/204 behavior-pack-has-pack-scope

The behavior pack manifest of an add-on declares `pack_scope`. Add-on content type only.

Fix: remove `pack_scope` from the behavior pack `manifest.json`.

## MARKETPLACE/205 world-resource-pack-in-both-locations

A world has a resource pack under both `Content/resource_packs` and `Content/world_template/resource_packs`. A resource pack goes under `Content/world_template/resource_packs/RP_Acronym`, or under `Content/resource_packs/RP_Acronym` when it is a standalone full conversion, not both. World content type only.

Fix: keep the resource pack in one location and delete the other copy.

## MARKETPLACE/206 pack-versions-differ

Pack manifests in one submission have different `header.version` values. The comparison includes the behavior pack, resource pack, world template, and skin pack manifests. Skipped for persona and emote, which have one manifest only.

Fix: set `header.version` to the same value in every `manifest.json`.

## MARKETPLACE/207 min-engine-versions-differ

The behavior pack and resource pack manifests have different `header.min_engine_version` values. Skin packs have no `min_engine_version` and are not compared.

Fix: set `header.min_engine_version` to the same value in both manifests.

## MARKETPLACE/208 world-pack-reference-mismatch

The `version` of a pack reference in `world_behavior_packs.json` or `world_resource_packs.json` does not match `header.version` in the pack manifest. World content type only. A reference to a pack not present in the world is reported by WORLD/301.

Fix: update the `version` in the pack reference file to match the manifest.

## MARKETPLACE/209 pack-folder-count-invalid

More than one pack folder is under `behavior_packs` or under `resource_packs`. Every pack in that folder is reported.

Fix: keep one pack folder under each, merging the extra packs or moving them to a separate submission.

## MARKETPLACE/301 pack-not-referenced

A pack inside the world template is not listed by `pack_id` and `version` in `world_behavior_packs.json` or `world_resource_packs.json`. World content type only. A reference to a pack not present in the world is reported by WORLD/301.

Fix: add an entry with the pack `uuid` as `pack_id` and its `header.version` as `version`.

## MARKETPLACE/701 archive-folder-not-allowed

A folder named `__brarchive` is inside the submission. Archiving files this way keeps them in the pack, and a submission may not contain them. The name is matched ignoring case, at any depth, inside a pack, a subpack, or anywhere else under the submission root. One finding per folder, reported on the folder path. A folder with no files inside it is not seen, because the tool reads files.

Fix: delete the `__brarchive` folder, or move it outside the submission.

## Notes

The expected folder tree per content type is in [Layouts](../layouts.md). Packs are found by manifest search in every layout, so a pack in the wrong folder or with the wrong name is still found and reported. No check here depends on a fixed folder name being present.
