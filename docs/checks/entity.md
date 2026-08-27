# ENTITY

Rules that apply only to entity definition files in the `entities` folder of a behavior pack. The version field, the file structure, and the `identifier` namespace are checked by [DEFINITION](definition.md).

Runs for: addon, world, texture.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| ENTITY/601 | minecraft-runtime-identifier | recommendation | runtime_identifier starts with `minecraft:` |

## ENTITY/601 minecraft-runtime-identifier

`description.runtime_identifier` starts with `minecraft:`, matched ignoring case. Reusing vanilla runtime behavior is allowed in worlds but the entity may behave in unexpected ways. Does not run for the addon content type, where ADDON/212 reports the same condition as an error.

Fix: remove `description.runtime_identifier` or set a value without the `minecraft:` prefix.
