# Contributing

How the code is organized, how to add a check, and the rules the code follows.

## Setup

Node 22 or later.

```
npm install
npm run lint      type check, ESLint, Prettier check
npm run fmt       format and apply fixes
npm test          build, then run the tests
npm run test:unit run the unit tests without building
npm run build     compile to dist/
npm run vanilla   rebuild src/Data/VanillaHashes.json from the newest samples release tag
npm run vanilla:check   exit 1 when a newer samples release tag exists
```

`.nvmrc` contains the Node version used for development and CI. CI runs `lint`, `test`, and a dry run of `npm pack` on pull requests to `main` and on every push to `main`, on Node 22 and 24, on Linux and Windows. Never edit `dist/`.

Everything Spyglass knows about Minecraft, where it comes from, and how it is updated is in [Minecraft versions](minecraft-versions.md). The steps for every Minecraft release are in [Game update steps](game-update.md).

## Architecture

Four layers, bottom up. Paths are relative to `src/`.

1. `Storage/`. One interface for folders and files, with implementations for the file system and for archives. Nothing above this layer reads content files.
2. `Model/`. Discovery scans the input and produces packs and worlds with types, each containing classified items (manifest, entity, texture, and so on). Packs are found by manifest search in every layout. The marketplace layout adds art discovery, nothing else. Folder name rules are checks, never discovery conditions, so a misnamed pack is still found and reported.
3. `Checks/`. One folder per group, one class per check. Each group folder has a `<Group>Checks.ts` abstract class listing its numbers as `static readonly` constants and a `<Group>Limits.ts` for thresholds. `CheckRunner` takes the resolved check set and the model, runs each check, and collects findings. Shared slow work (vanilla hash table, image metadata, world database read, cross reference index) is in `Loaders/`, cached, and is requested by checks, so skipping a group skips that work.
4. `Cli/`. Parses options, resolves the check set from content type, layout, config, and `--skip`, runs, writes the report, sets the exit code.

Findings contain check ID, slug, severity, message, file path, pack, and optional location. Severity comes from the check definition. `--fail-on` decides the exit code.

Tool failures are exceptions that end the run with exit code `3`, never findings. A tool failure is a failure of the environment: archive read, vanilla data read. A file inside the content that cannot be read is `FILE/207`, and other checks skip that file.

The two run time lookups, the game version and the beta module versions, are not tool failures. Each one has a timeout, and a failed lookup prints a notice and falls back, so a run without network access still produces a report. See [Command line](cli.md#environment).

## Adding a check

1. Update the docs first. Add the row to the summary table in `docs/checks/<group>.md` and write its section. The doc is the spec. A test compares every table row to the registered definition, so ID, slug, severity, and description must match the code exactly.
2. Pick the ID. Next free number in the category that fits. See [Checks](checks/README.md) for categories. Numbers never change and are never reused.
3. Add the number to `<Group>Checks.ts`. Any threshold goes in `<Group>Limits.ts` as a named constant.
4. Create `Checks/<Group>/<Slug>.ts`, slug in PascalCase, extending the group base class. The class declares its `definition` and returns findings.
5. Register it in the group check list.
6. Write `tests/Unit/<Name>.test.ts` with a helper and types file of the same name. Include the pass case and the fail case.
7. Run `npm run fmt`, `npm run lint`, `npm test`.

Rules for a check:

- One check, one fix. Two situations that need different fixes are two checks. The same fix with a different detail is one check with the detail in the message.
- Location is data. File, pack, and field path go in the finding, never in the ID.
- A check that runs only for some content types declares them. The runner applies that restriction. The check never inspects the content type to decide whether to run.
- A check returns findings. It does not print, exit, or use the network. Version data and npm data come from a loader that the CLI fills before checks run.
- No duplicated branches per pack type. Parameterize.
- No unused IDs. If a check is not implemented, it is not in the ID list.
- No early return that skips reporting and no exception that is caught and ignored. Throw, and the CLI converts it into exit code `3`.

## Removing a check

A check is removed only when the game no longer has the thing it checks. Delete the class, the number in `<Group>Checks.ts`, the test, and the doc row. Add the ID to the retired list in [Checks](checks/README.md) with one line saying why. The number is never reused. Removal is a breaking change.

## Groups and IDs

- A group is the subject, never the problem and never a mode. `MANIFEST`, not `NOBOM` or `STRICT`.
- A check that applies to exactly one content type is in that content type group: `WORLD`, `SKIN`, `TEXTUREPACK`, `ADDON`, `PERSONA`, `EMOTE`. `EMOTE` is part of the `persona` content type and runs only for packs whose `piece_type` is `persona_emote`. Subject groups contain only checks shared by two or more content types.
- One uppercase word, full spelling.
- Rough size 5 to 40 checks. Over 40, split by subject. Never renumber.
- Rules every definition file shares, such as `format_version`, schema, and the `minecraft:` namespace, are in `DEFINITION`. A group named after one file type contains only rules specific to that type. The expected version per file type is data in `DefinitionLimits.ts`, not a separate check.
- Severity is fixed. No option changes it. `--fail-on` decides, and its default does not change with layout.
- Config comes from the working directory or `--config` only, never from the content under validation.

## Conventions test

`tests/Unit/CodeConventionsApplyAcrossSourceAndTests.test.ts` scans `src/`, `tests/`, and `scripts/` and fails on any file that does not follow a rule the compiler and the linter cannot see:

- The default export class name equals the file name, and there is exactly one class.
- Nothing at file scope except imports and the class. Entry points may end with one `await <Class>.main();` line. Test files contain only `test()` calls and loops around them.
- No comments under `src/` or `tests/`. No block comments anywhere. A line comment under `scripts/` is one line, never ends with a period, and never follows another line comment.
- `interface`, `type`, and `enum` appear only under a `Types/` folder.
- No `public` modifier.
- Every unit and integration test has a helper and a types file of the same name.
- `Main.TOOL_VERSION` equals `version` in `package.json`.
- No test file or scenario text file spells out the game version of that tag. Fixtures use `ModelFixture.DEFAULT_GAME_VERSION`, scenarios use `__CURRENT_GAME_VERSION__`.
- A test of version comparison logic injects a made up current version such as `10.30.20` through `currentGameVersion`, so the numbers in the case names are stable and never look like a date. The rule: tests of version logic use the fictional version, everything else uses the derived one.

A rule that matters to every file goes here, not in a review comment.

## Tests

`node:test` only. No other test framework.

- `tests/Unit/` tests checks, storage, discovery, and helpers with in memory fixtures.
- `tests/Integration/` runs the built CLI on sample content under `tests/Scenarios/` and compares against an expected report with the changing fields removed. Regenerate expected reports with the environment variable given in the test, never manually.
- Scenario content never states a game version. Write `__CURRENT_GAME_VERSION__` where a `format_version` or `min_engine_version` string is required. The runner copies the scenario into `tests/Results/Scenarios/` with the version of the vanilla samples tag filled in and runs the CLI on the copy. The conventions test fails when a scenario text file or a test writes the version out.

Naming:

- Every test file has a helper and a types file with the same name. `tests/Unit/<Name>.test.ts` reads from `tests/Helpers/<Name>.ts`, which takes its types from `tests/Types/<Name>Types.ts`.
- Code shared by more than one test is in `Helpers/Core/` and `Types/Core/`, or in a subject subfolder such as `Helpers/World/` and `Types/World/` when it serves one group only. Move a function there only when a second test needs it.
- Test files contain only `test()` blocks and assertions. Fixture building, reading, and scanning go in the helper.
- `<Name>` states what the test verifies as an assertion. `UuidDuplicateReportsRepeatedHeaderUuid`, not `Manifest`.
- Every case name is understandable without other context. Form: `<input> <reason the check decides that way>`. `persona_wings is not a known piece type`, not `unknown type`. Threshold cases state the side of the limit. Never only `passes` or `fails`.
- Fixtures are small: a manifest object or a two file pack, never a whole sample project.
- No count tests. Hardcoded error counts per sample fail on every content change.

## Code conventions

- TypeScript `strict`, ES modules. Dependencies only for work that is difficult to write manually (image metadata, zip reading, world database reading). Say why before adding one.
- One class per file. Filename equals the class name. `export default class`. Nothing at file scope except imports and the class.
- A class that is never instantiated is `abstract class` with only `static` members. A class that is instantiated or inherited keeps its members on the instance.
- Types, interfaces, and enums are in `Types/` only, in the file matching their area.
- `PascalCase` for classes, files, folders. `camelCase` for methods and variables. `UPPER_SNAKE_CASE` for `static readonly` fields. Full words, no abbreviations.
- Type imports first, then value imports. `import type` for types.
- Explicit `private`, `protected`, `readonly`, `static`. Omit `public`. Explicit return type on every function.
- `unknown` over `any`, then narrow.
- `console.log` is banned. All output goes through the reporter.
- Early returns instead of nested conditions. No `else` after a return. Three levels of nested `if` is the limit.
- Function names are verb phrases, except accessors that return a named part of their input, such as `header(manifest)`.
- No unexplained numbers. Thresholds are in the group `Limits` file.
- No static mutable globals. Pass loaders in.
- Nothing in `src/` or `tests/` is named after another tool or project. Only Minecraft data appears.
- All text is literal. No idioms, metaphors, or figurative words in names, messages, docs, or test case names. Write `contains` not `holds`, `is part of` not `belongs to`, `file name without the extension` not `stem`. Real Minecraft terms stay, such as `hold_on_last_frame`, walk cycle, and stray.
- Run the formatter. Do not format manually.

Member order inside a class: fields (`static readonly`, `private static readonly`, `static`, `private static`, `readonly`, `private readonly`, plain, `private`), then static methods with `init()` first, `protected static`, `private static`, constructor, instance methods with `init()` then `run()` first, `protected`, `private`.

No comments in `src/` or `tests/`. Meaning goes into names and structure. A line that needs a comment becomes a method whose name is the comment. A value that needs a comment becomes a named constant. A check that needs explanation gets it in its doc page.

## Versioning and releases

Semantic Versioning. The public interface is the command line in `docs/cli.md`, the exit codes, the JSON report structure, the check IDs with their severities, and the `Main` module exported from the package.

| Change | Version |
|---|---|
| New check, new option, new content type, message wording, vanilla data rebuild | minor |
| Fix to a check that reported wrongly | patch |
| Removed check, removed option, changed default, changed severity, changed exit code | major |
| Any field removed or renamed in the JSON report | major, and `schema_version` increments |

Adding a field to the JSON report is minor and does not change `schema_version`. Text output is not part of the stable interface.

`CHANGELOG.md` has an `Unreleased` section at the top with `Added`, `Changed`, `Fixed`, and `Removed` headings. Every pull request adds a line there.

Release: move `Unreleased` to a version heading with the date, set the same version in `package.json` and `Main.TOOL_VERSION`, commit as `CHANGE | Release 1.2.0`, tag `v1.2.0`, push the tag. The publish workflow runs `lint` and `test` and publishes to npm with provenance.

Dependency updates come as grouped monthly pull requests. Only development dependencies exist. Merge when CI passes.

## Commits

`TYPE | Description`, or `TYPE | TICKET | Description`. Types: `ADD`, `CHANGE`, `FIX`. Example: `ADD | Add ART checks`.
