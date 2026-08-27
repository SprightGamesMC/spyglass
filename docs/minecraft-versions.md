# Minecraft versions

Which Minecraft data Spyglass includes, where it comes from, and how it is updated. This page contains no version numbers. The numbers are in the code and data files this page lists.

## Data sources

| Data | Used by | Source | Kept in | Updated by |
|---|---|---|---|---|
| Current game version | `5xx` checks that compare against the current release | `version.json` in the samples repository, fetched at run time. When the fetch fails, the verified game version below | Nothing. Override with `SPYGLASS_GAME_VERSION` | Automatic on every run |
| Vanilla file hashes, sound events, sound file paths, definition IDs | `PACK`, `BLOCK`, `TEXTUREPACK`, `ADDON`, `WORLD` | The samples repository at the release tag below | `src/Data/VanillaHashes.json` with the tag and date in its `source` field | `npm run vanilla` |
| Highest format version per file type | `DEFINITION/501`, `DEFINITION/502` | The samples repository at the release tag below | `src/Data/VanillaHashes.json` in its `formatVersions` field | `npm run vanilla` |
| Beta script module versions | `SCRIPT/501` | npm registry, fetched at run time. When the fetch fails, no versions and the check reports nothing | Nothing. Skip with `SPYGLASS_SKIP_NPM` | Automatic on every run |
| Vanilla commands | `SCRIPT` command checks | Written manually from the game | `src/Data/MinecraftCommands.ts` | Manually when the game adds commands |
| JSON schemas | Schema checks per definition kind | Written manually from the game documentation | `src/Data/Schemas/` | Manually when the game changes a format |
| Format versions and engine limits | `5xx` and `4xx` checks | Game documentation and Marketplace requirements | `src/Checks/<Group>/<Group>Limits.ts` | Manually, one commit per game version |

## Vanilla samples

The tag is recorded once, in the `source` field of `src/Data/VanillaHashes.json`, as `tag` with the rebuild date as `date`. It is the newest non preview release of the samples repository at the time the data was rebuilt. It is not repeated in the docs. Each rebuild states the tag in its `CHANGELOG.md` entry.

- `npm run vanilla` resolves the newest release tag, downloads that tag, and rewrites the data file. `npm run vanilla -- --tag <tag>` builds a specific tag.
- `npm run vanilla:check` only resolves the newest release tag and exits `1` when it differs from the recorded one. A scheduled job runs it weekly and opens a pull request with the rebuilt data.
- Review the diff of `VanillaHashes.json` before merging. New vanilla files change what the `PACK` vanilla copy checks and the `TEXTUREPACK` coverage checks report.

## Verified game version

The game version Spyglass was verified against is that tag without the `v` and the fourth number. It is written nowhere else. Tests read it from `VanillaHashes.json` through `VanillaLoader.sourceGameVersion()`, fixtures use `ModelFixture.DEFAULT_GAME_VERSION`, and the integration runner passes it as `SPYGLASS_GAME_VERSION`. The conventions test fails when any test file writes the version out.

Every game release is handled with the [Game update steps](game-update.md).
