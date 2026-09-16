# Changelog

All notable changes to Spyglass. Format follows Keep a Changelog. Versions follow Semantic Versioning as described in [Contributing](docs/contributing.md#versioning-and-releases).

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
