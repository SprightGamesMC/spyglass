# Game update steps

What to do in this repository every time Minecraft Bedrock publishes a release. Follow it top to bottom. Every step states the file it changes and how to prove it is done. The goal is that two people doing the same release produce the same pull request.

Preview and beta builds are ignored. Only a release tag of the samples repository starts these steps.

## Trigger

The weekly `Vanilla data` workflow runs `npm run vanilla:check`. When the samples repository has a newer non preview release tag it rebuilds `src/Data/VanillaHashes.json`, regenerates the scenario reports, and opens a pull request named `CHANGE | Vanilla data <tag>`. That pull request is the start of the release work. Do not merge it without changes. Turn it into the release pull request by working through the steps below on its branch.

To start manually: `npm run vanilla`, then follow the same steps.

## Sources to read

Read all three before changing anything. Keep a short list of what changed that could affect a check.

| Source | Where | What to check |
|---|---|---|
| Samples diff | `https://github.com/Mojang/bedrock-samples/compare/<old tag>...<new tag>` | New or removed files under `resource_pack/` and `behavior_pack/`, `format_version` increases in any JSON, new folders, new sound events, new commands in `.mcfunction` samples, `version.json` |
| Release changelog | `https://feedback.minecraft.net/hc/en-us/sections/360001186971` | Sections named Add-ons, Technical updates, Commands, Scripting, Experimental features, and anything that says deprecated or removed |
| Creator documentation | `https://learn.microsoft.com/minecraft/creator/` | Reference pages for the definition kinds Spyglass has schemas for. Compare against `src/Data/Schemas/` |

The old tag is `source.tag` in `VanillaHashes.json` on `main`. The new tag is the one the workflow wrote.

## Steps

Each step is one commit on the release branch, prefixed `CHANGE |`. Skip a step when the sources show nothing for it, but say so in the pull request body.

### 1. Vanilla data

Already done by the workflow. Review the diff of `VanillaHashes.json` with `git diff --stat` and a JSON aware diff. Check:

- Removed files. Any check that refers to a vanilla path in a `Limits` file or in `src/Data/VanillaTextureExemptions.ts` needs review.
- Folders listed in `src/Data/VanillaEnginePaths.ts` that now appear in the samples. Remove them from the list.
- New top level folders under `textures/`. Decide whether to add them to `VanillaTextureExemptions.ts` (folders a texture pack is not expected to override).
- New sound events and definition IDs are included automatically.

Proof: `npm run vanilla:check` exits `0`.

### 2. Version arithmetic

`src/Loaders/VersionUtilities.ts` and `src/Cli/VersionFetcher.ts`.

- If the game skipped a minor number (as it did from `1.21` to `1.26`), add the skipped numbers to `UNRELEASED_MINORS`. The `previous minor` rule in `docs/checks/README.md` depends on it.
- If the numbering scheme for preview builds changed, review `PREVIEW_PATCH_THRESHOLD`.
- Run `SPYGLASS_GAME_VERSION` unset once against a real pack and confirm the fetched version equals the new release. Then leave it unset in no test.

Proof: `tests/Unit/VersionUtilitiesComparesWithSkippedMinors.test.ts` gets a new case in the `previousMinor` test when a gap was added.

### 3. Format versions and engine limits

Every constant is in a `Limits` file. Go through this table row by row against the changelog and the samples diff.

| Constant | File | Changes when |
|---|---|---|
| `EXPECTED_FORMAT_VERSION` | `Animation/AnimationLimits.ts`, `Attachable/AttachableLimits.ts` | Samples increase the format version of animations, controllers, or attachables |
| `FLOOR_VERSIONS` | `Definition/DefinitionLimits.ts` | Samples lower the oldest accepted version of attachables, resource pack entity files, particles, or geometry |
| `ANIMATION_FORMAT_VERSION` | `Emote/EmoteLimits.ts` | Emote format guidance changes |
| `GEOMETRY_FORMAT_VERSION` | `Persona/PersonaLimits.ts` | Persona geometry format guidance changes |
| `VALID_FORMAT_VERSIONS`, `STRING_VERSION_FORMAT_VERSION` | `Manifest/ManifestLimits.ts` | A new manifest `format_version` is introduced |
| `FORMAT_1_MIN_ENGINE_VERSION_LIMIT`, `PBR_MIN_ENGINE_VERSION` | `Manifest/ManifestLimits.ts` | The changelog changes the minimum version for a feature |
| `NAMESPACE_CHECK_MINIMUM_VERSION` | `Particle/ParticleLimits.ts` | The particle namespace rule changes |
| `MODERN_COMMAND_GAME_VERSION`, `MODERN_COMMAND_VERSION` | `Chunk/ChunkLimits.ts` | Command block storage version changes |
| `LOCK_TEMPLATE_OPTIONS_FORMAT_VERSION` | `World/WorldLimits.ts` | World template manifest rules change |
| Size, count, and memory limits | Every `Limits` file | Marketplace requirements change, not the game. See step 8 |

Fog, spawn rule, and render controller versions are not constants. `npm run vanilla` records the highest `format_version` per file type in `src/Data/VanillaHashes.json`, and DEFINITION/501 and DEFINITION/502 read it from there.

For every constant changed, change the sentence in `docs/checks/<group>.md` that states the value. The doc is the spec.

Proof: `npm test`. The check tests use a fictional current version, so a changed constant fails its own test until the test case is updated to match.

### 4. Schemas

`src/Data/Schemas/` contains one schema per definition kind, written manually: biome, client biome, block, entity, feature, feature rule, fog, item, manifest, persona meta, recipe, skins, sound definitions, spawn rule.

For each kind listed in the changelog:

- Add new components, fields, and enum values to the schema. A missing field makes a valid pack fail a `2xx` schema check, which must not happen.
- Do not remove fields the game still accepts for older `format_version` values. Mark nothing deprecated in the schema. Deprecation is a separate check if it matters.
- Copy one real sample of the changed kind from the samples diff into the matching `tests/Unit/<Kind>SchemaInvalidGroupsIssuesByKind` helper as a pass case.

Proof: every scenario still passes with no new `2xx` findings on vanilla style content.

### 5. Commands

`src/Data/MinecraftCommands.ts` lists every built in command. The changelog Commands section names additions and removals. Removed commands stay in the list for one major version of Spyglass, then move to a deprecated check.

Proof: `tests/Unit/UnknownCommandReportsUnlistedCommand.test.ts`.

### 6. Script modules

`src/Cli/VersionFetcher.ts` `BETA_MODULES` lists the `@minecraft` packages whose beta tags are fetched. Add new official modules from the Scripting section of the changelog.

Proof: `npm run build` and one run with `SPYGLASS_SKIP_NPM` unset shows the new module in verbose output.

### 7. New checks

New game features usually mean a new thing that can be wrong. Decide for each Add-ons and Technical updates entry whether a new check is needed. If yes, follow `contributing.md` Adding a check. If no, write one line in the pull request body saying why not, so the question is not asked again.

### 8. Marketplace requirements

Limits that come from the Marketplace, not the game: file counts, texture memory tiers, art sizes, name rules. These change independently of game releases. Once per game release, reread the current partner requirements and confirm every numeric limit in `Addon`, `Art`, `Marketplace`, `Skin`, `Texture`, and `TexturePack` limits files. Change nothing without a source you can cite in the commit body.

### 9. Scenarios

The workflow already regenerated `tests/Scenarios/*/expected.json`. Read every changed expected report. Each new or removed finding must be explained by a step above. A finding you cannot explain is a bug. Fix the code, then regenerate with `SPYGLASS_UPDATE_SCENARIOS=1 npm test`.

Add one scenario input for any new feature that got a check in step 7.

### 10. Record and release

- `CHANGELOG.md` under `Unreleased`: one `Changed` line naming the samples tag, plus one line per constant, schema, command, or module changed. When nothing but the data changed, still write `Reviewed against <tag>, no check changes`.
- Version increase follows the table in `contributing.md`. Data only is minor. A constant that makes previously passing content fail is major.
- Merge, then release as described in `contributing.md`.

## Definition of done

- [ ] `npm run vanilla:check` exits `0`
- [ ] Every row in the step 3 table was checked against the sources, changed or not
- [ ] Every schema kind listed in the changelog was updated and has a sample based pass case
- [ ] Commands and script modules match the changelog
- [ ] Every changed expected report line is explained in the pull request body
- [ ] `docs/checks/<group>.md` matches every changed constant
- [ ] `CHANGELOG.md` has the entry
- [ ] `npm run lint` and `npm test` pass on Node 20 and 22

## What never changes in a game update

- Check IDs. A check that no longer applies is retired per `contributing.md`, never renumbered.
- Severities. A game change does not change a severity.
- The JSON report structure.
- Any version number inside `tests/`. Tests read the current version from the vanilla data or use a fictional one.
