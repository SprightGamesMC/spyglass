# BLOCK

The `blocks.json` catalog in a resource pack, which maps block identifiers to textures and sounds. The version field and the file structure of block definition files in a behavior pack are checked by [DEFINITION](definition.md).

Runs for: addon, world, texture.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| BLOCK/301 | catalog-resource-unused | warning | blocks.json entry not used by any block |
| BLOCK/501 | deprecated-override | warning | blocks.json defines a deprecated vanilla block |
| BLOCK/601 | catalog-vanilla-override | recommendation | blocks.json entry overrides a vanilla block |

## BLOCK/301 catalog-resource-unused

An identifier in `blocks.json` has no matching block definition in any behavior pack. Skipped for the texture content type, which has no behavior pack.

Fix: remove the entry, or correct its identifier so it matches a defined block.

## BLOCK/501 deprecated-override

`blocks.json` has a top level key named `fletching_table` or `smithing_table`. An entry for either has no effect.

Fix: remove the entry.

## BLOCK/601 catalog-vanilla-override

An entry in `blocks.json` uses a vanilla block identifier, so it overrides the textures or sounds of that block. Skipped for the texture content type, where overriding vanilla is expected, and for the addon content type, where ADDON/705 reports the same condition as an error.

Fix: if the override is not intended, remove the entry or rename it to your own namespaced identifier.
