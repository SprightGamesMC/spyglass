# Checks

Every check has an ID in the form `GROUP/NNN`, a slug, a fixed severity, and a page section that says what it checks and how to fix it.

```
MANIFEST/601 uuid-duplicate
```

- `GROUP` is the subject: the file, folder, or content kind the check examines.
- The first digit of `NNN` is the category, what kind of problem it is.
- The last two digits are a sequence number.

IDs never change. A removed check leaves a gap and is listed under [Retired IDs](#retired-ids).

## Severity

| Level | Meaning |
|---|---|
| `error` | Invalid or will be rejected |
| `warning` | Works, but is a problem for submission or players |
| `recommendation` | Works, could be better |

Severity is fixed per check. `--fail-on` decides which levels fail the run, and the config file or `--severity` can override a level. See [Command line](../cli.md).

## Categories

| Range | Category | Meaning | Example |
|---|---|---|---|
| `1xx` | Missing | A required thing is absent | `MANIFEST/105` no pack_icon.png |
| `2xx` | Invalid | The thing exists but is malformed | `MANIFEST/203` uuid not valid |
| `3xx` | Reference | Points at something that does not exist, or is never pointed at | `TEXTURE/301` texture not in texture list |
| `4xx` | Limit | Too big, too many, too long | `TEXTURE/401` texture memory over recommended |
| `5xx` | Version | Older, newer, or deprecated relative to the expected version | `DEFINITION/501` format_version below expected |
| `6xx` | Conflict | Duplicates or overrides of something that already exists | `MANIFEST/601` duplicate uuid |
| `7xx` | Policy | Valid and works, but the platform forbids it | `WORLD/701` experiment enabled |

Skip a whole category inside a group with a range: `--skip TEXTURE/400-499`.

## Groups

| Group | Subject |
|---|---|
| [FILE](file.md) | Facts about a file that need no Minecraft knowledge. Encoding, BOM, path length and depth, case, invalid characters, JSON syntax |
| [PACK](pack.md) | The pack as a folder. Allowed file types, unknown files, unused assets, missing references, size and file count, vanilla copies |
| [MANIFEST](manifest.md) | `manifest.json`. Header, modules, uuids, dependencies, subpacks, settings, capabilities, pack icon, `min_engine_version` |
| [LANG](lang.md) | `languages.json` and `.lang` files |
| [TEXTURE](texture.md) | Images, texture lists, texture sets, memory limits and tiers |
| [MODEL](model.md) | Geometry |
| [SOUND](sound.md) | `sound_definitions.json` |
| [PARTICLE](particle.md) | Particle only rules. Namespaced identifier |
| [SCRIPT](script.md) | Script modules, beta APIs, commands in `.mcfunction` files |
| [ENTITY](entity.md) | Entity only rules. `runtime_identifier` |
| [BLOCK](block.md) | Block only rules. `blocks.json` catalog |
| [DEFINITION](definition.md) | Rules shared by every definition file. `format_version`, schema, `minecraft:` namespace. Entities, items, blocks, animations, attachables, particles, recipes, spawn rules, fog, biomes, features |
| [WORLD](world.md) | World template files. `level.dat`, icon, pack references, `base_game_version`, experiments |
| [CHUNK](chunk.md) | The world `db` folder. Command blocks, custom dimensions. Slow |
| [TEXTUREPACK](texturepack.md) | Texture pack only rules. Resource pack alone, vanilla texture coverage |
| [SKIN](skin.md) | `skins.json` and skin textures |
| [PERSONA](persona.md) | Persona piece meta, textures, tint maps, geometry, zones. Persona pieces and emotes |
| [EMOTE](emote.md) | Emote animation file, bones, pose, movement limits, chat strings. Packs whose `piece_type` is `persona_emote` |
| [MARKETPLACE](marketplace.md) | Submission zip folder structure and cross pack consistency |
| [ART](art.md) | Marketing Art and Store Art files |
| [ADDON](addon.md) | Add-on rules. Creator folder layout, one BP and one RP, namespaced ids, size and count limits, blocked commands |

## Which groups run

| Content type | Groups |
|---|---|
| `addon` | FILE, PACK, MANIFEST, LANG, TEXTURE, MODEL, SOUND, PARTICLE, SCRIPT, ENTITY, BLOCK, DEFINITION, ADDON |
| `world` | Same as `addon` without ADDON, plus WORLD, CHUNK, SKIN. SKIN/401, SKIN/402, and SKIN/403 are skipped |
| `skin` | FILE, PACK, MANIFEST, LANG, TEXTURE, SKIN |
| `texture` | FILE, PACK, MANIFEST, LANG, TEXTURE, MODEL, SOUND, PARTICLE, ENTITY, BLOCK, DEFINITION, TEXTUREPACK |
| `persona` | FILE, PACK, MANIFEST, LANG, PERSONA, EMOTE |

`--layout marketplace` adds MARKETPLACE and ART for every content type. Some checks in shared groups skip one content type where the rule does not apply. Each such check says so on its page.

## Subpacks

A resource pack subpack is the folder `subpacks/<folder>` inside the pack. It has the same structure as the pack it is part of and provides its files at the pack root paths. It has no manifest of its own and contains no further subpacks.

Checks read a file inside a subpack by its path inside that subpack, so folder rules, reserved names, vanilla comparisons, references, and texture lists apply to it the same way. [LANG](lang.md) is the exception: it reads the `texts` folder at the pack root only. Texture lists are the one place where the two are kept apart: a texture at the pack root must be listed at the pack root, while a subpack texture may be listed in either. See [TEXTURE/301](texture.md#texture301-not-in-texture-list).

## What is not a check

- A tool failure, such as an archive that cannot be extracted, ends the run with exit code `3`. A file inside the content that cannot be read is `FILE/207`.
- Counts and lists with no action, such as how many entities a pack has, are not reported.

## Retired IDs

Checks removed because the game no longer has the thing they checked. Numbers are never reused.

