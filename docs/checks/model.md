# MODEL

Geometry files under `models/` in each resource pack, and the bones and cubes they define.

Runs for: addon, world, texture.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| MODEL/201 | mesh-not-allowed | error | Geometry bone uses poly_mesh or texture_mesh |
| MODEL/401 | block-geometry-too-complex | warning | Block geometry has more than 50 cubes |

## MODEL/201 mesh-not-allowed

A bone defines a `poly_mesh` or `texture_mesh` field. Only cube based geometry is allowed. The message names the field.

Fix: rebuild the bone from cubes and remove the field.

## MODEL/401 block-geometry-too-complex

A geometry whose path contains `/blocks/` has more than 50 cubes in total. Geometry outside `/blocks/` is not checked.

Fix: merge or remove cubes so the model uses 50 or fewer.
