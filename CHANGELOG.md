# Changelog

All notable changes to Spyglass. Format follows Keep a Changelog. Versions follow Semantic Versioning as described in [Contributing](docs/contributing.md#versioning-and-releases).

## [0.4.0]

### Changed

- Vanilla data built from samples tag `v1.26.60.5`. The new vanilla textures are all under `textures/ui`, so TEXTUREPACK counts do not change.
- MANIFEST/201 accepts the optional multiselect setting field `selection_text` and reports it when it is not a string.
- ADDON/703 treats `editor-allowlist` as world impacting.
- Reviewed format version constants, schemas, script modules, and Marketplace limits against `v1.26.60.5`. No constant changed.

### Fixed

- A behavior pack `sounds/sound_definitions.json` contains server sound definitions, not the resource pack catalog. SOUND/201 and ADDON/210 no longer report it.
- SCRIPT/201 and CHUNK/201 no longer report the built in `packstack` and `editor-allowlist` commands as unknown.

## [0.3.0]

### Added

- Config key `ignore`. Each entry removes the findings of the selected checks that match an optional `path` and `pack` pattern and an optional `field`, with a required `reason`. The checks still run. Ignored findings do not count for `--fail-on`.
- JSON report field `ignored` with each ignored finding and its reason. `schema_version` stays 1.
- The summary line ends with the ignored count when a finding was ignored.
- A notice on stderr for an ignore entry that matched no finding in a check that ran.
- `check` command. `spyglass check addon` validates an add-on.
- Config keys `contentType`, `input`, `layout`, `output`, `format`, `verbosity`, and `noColor`. `input` and `output` are relative to the config file. Each setting comes from the command line, then the config, then the default, so `spyglass check` can take every setting from `spyglass.config.json`.
- JSON schema for the config file at `schema/spyglass.config.schema.json` in the package. The config accepts a `$schema` key that points to it.

### Changed

- The content type follows the `check` command. `spyglass addon` is a usage error that names `spyglass check addon`.
- `spyglass` with no command prints the help and exits `0`.
- `--list-rules` with a content type is `spyglass check <content type> --list-rules`.
- An unknown key in the config file is a usage error. Before, it was ignored.
- TEXTURE/304 checks every texture that supports a texture set, not only textures under `textures/blocks` and `textures/entity`. A texture is checked when it replaces a vanilla texture that has a texture set, is in a vanilla folder with texture sets, or is referred to by a texture file, client entity, attachable, or particle. Up to two add-on folders under `textures` are skipped when finding the folder. Textures in `colormap`, `environment`, `gui`, `map`, `misc`, `persona_thumbnails`, and `ui` are not checked.

## [0.2.1]

### Removed

- SKIN/208 skin-name-invalid. It reported a skin `localization_name` with a digit or underscore, a rule with no source. The ID is retired.

## [0.2.0]

### Changed

- Vanilla data built from samples tag `v1.26.50.4`. New vanilla textures raise TEXTUREPACK/301 counts for texture packs that do not override them.
- MANIFEST/104, MANIFEST/201, MANIFEST/215, MANIFEST/217, MANIFEST/401, and MANIFEST/606 accept and check the `multiselect` setting type with its `defaults` list.
- DEFINITION/201 accepts `minecraft:multipart_block_column_feature`.
- SOUND/201 accepts `allow_concurrent_streaming` in a sound definition.
- SCRIPT/201, CHUNK/201, and ADDON/703 know the `serveridentity` command. ADDON/703 treats it as world impacting.
- SCRIPT/501 fetches the beta version of `@minecraft/server-graphics`.
- DEFINITION/101, DEFINITION/501, and DEFINITION/502 check jigsaw structure, template pool, structure set, and processor list files under `worldgen`. The lowest version is `1.21.20`, the highest is the current release.
- Reviewed format version constants, schemas, and Marketplace limits against `v1.26.50.4`. No constant changed.

## [0.1.1]

### Fixed

- LANG/202 reports a key that contains a character other than a letter, digit, `.`, `_`, `:`, or `-`.
- LANG/202 reports a `#` after the value that is not a comment written as a tab followed by `##`.

## [0.1.0]

### Added

- First release. Checks for add-ons, world templates, skin packs, texture packs, persona pieces, and emotes.
- JSON report `schema_version` 1.
- Vanilla data built from samples tag `v1.26.40.05`.
