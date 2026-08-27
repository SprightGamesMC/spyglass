# TEXTUREPACK

A texture pack project as a whole: which packs it contains and how much of the vanilla texture set the resource pack overrides.

Runs for: texture.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| TEXTUREPACK/101 | resource-pack-missing | error | No resource pack manifest |
| TEXTUREPACK/301 | vanilla-texture-not-overridden | warning | A vanilla texture is not overridden |
| TEXTUREPACK/401 | coverage-too-low | error | Under 95 percent of vanilla textures are overridden |
| TEXTUREPACK/601 | multiple-resource-packs | error | More than one resource pack manifest |
| TEXTUREPACK/701 | behavior-pack-not-allowed | error | Behavior pack present |

## TEXTUREPACK/101 resource-pack-missing

The project has no resource pack `manifest.json`. A texture pack must contain exactly one resource pack.

Fix: add a resource pack folder with a `manifest.json` whose module type is `resources`.

## TEXTUREPACK/301 vanilla-texture-not-overridden

A vanilla texture that counts toward coverage is not overridden by the resource pack. One finding per texture. See [Notes](#notes).

Fix: add a texture at the same path as the reported vanilla texture.

## TEXTUREPACK/401 coverage-too-low

The resource pack overrides under 95 percent of the vanilla textures that count toward coverage. See [Notes](#notes).

Fix: add overrides until at least 95 percent are covered. The TEXTUREPACK/301 findings list each missing texture.

## TEXTUREPACK/601 multiple-resource-packs

The project contains more than one resource pack `manifest.json`.

Fix: merge the packs into one resource pack and remove the extra `manifest.json` files.

## TEXTUREPACK/701 behavior-pack-not-allowed

The project contains a behavior pack. A texture pack is a resource pack alone.

Fix: remove the behavior pack. If it is needed, the project is not a texture pack and needs a different content type.

## Notes

Vanilla texture coverage counts only vanilla textures under `textures/blocks`, `textures/entity`, and `textures/items`. Files whose name ends with `_mer`, `_mers`, `_normal`, `_heightmap`, or `_mipmap` followed by an optional number are excluded, as is an exemption list of about 130 paths such as `entity/npc`, `entity/villager`, `ui`, `gui`, `colormap`, `particle`, and `trims`. WORLD/702 uses the same rule.
