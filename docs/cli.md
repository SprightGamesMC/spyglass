# Command line

```
spyglass check [content type] [options]
spyglass --list-rules [options]
spyglass check [content type] --list-rules [options]
spyglass --help
spyglass --version
```

`-h` is short for `--help` and `-v` is short for `--version`. `spyglass` with no command prints the help and exits `0`.

## Settings order

Each setting comes from the command line first, then the config file, then the default. Every option except `--config`, `--help`, `--version`, and `--list-rules` can also be set in the config file. See [Config file](#config-file).

## Commands

### `check [content type]`

Validate the input. Content type is one of `addon`, `world`, `skin`, `texture`, `persona`. It can be given after `check` or as `contentType` in the config file. When neither gives it, the run is a usage error.

```
spyglass check addon --input ./MyAddon
spyglass check
```

The second form takes the content type, the input, and every other setting from `spyglass.config.json`.

## Input

### `--input <path>`

Folder or packaged file to validate. Packaged files: `.mcaddon`, `.mctemplate`, `.mcworld`, `.mcpack`, `.mcpersona`, `.zip`. Archives are read in memory.

Default: current folder.

### `--layout <standard|marketplace>`

- `standard`: any folder structure. Packs are found by `manifest.json` search.
- `marketplace`: a Marketplace submission zip. Packs are still found by search. Adds the MARKETPLACE and ART groups, which check the fixed folder names and the art files.

Default: `standard`. See [Layouts](layouts.md).

## Choosing checks

### `--skip <selector>`

Remove checks. Repeatable. Selector forms:

| Form | Example | Removes |
|---|---|---|
| Group | `TEXTURE` | Every check in the group |
| One | `TEXTURE/401` | One check |
| List | `TEXTURE/401,402,403` | Several checks in one group |
| Range | `TEXTURE/400-499` | Every check in a number range |

Unknown IDs are an error. A range that matches no check is an error. Skips from the config file and the command line are combined.

### `--config <file>`

Path to a config file. See [Config file](#config-file).

Default: `spyglass.config.json` in the current folder when it exists. The input is never searched for a config.

### `--severity <id>=<level>`

Change the severity of one check or one group. Repeatable. Levels: `error`, `warning`, `recommendation`. To turn a check off use `--skip`.

```
spyglass check addon --severity PACK/301=recommendation --severity LANG=error
```

### `--fail-on <error|warning|recommendation|none>`

Lowest severity that makes the exit code `1`. `none` always exits `0` after a completed run.

Default: `error`. The layout does not change it.

## Output

The report goes to stdout and contains only the findings. Progress and the summary go to stderr on every run. A `text` report written with `--output` is the exception and ends with the summary block.

### Summary block

Written to stderr at `--verbosity summary` and above, in this order:

```
Run at 2026-08-26T14:03:11Z
Summary: 1 errors, 1 warnings, 1 recommendations
  LANG: 0 errors, 0 warnings, 1 recommendations
  MANIFEST: 1 errors, 0 warnings, 0 recommendations
  PACK: 0 errors, 1 warnings, 0 recommendations
Elapsed: 412 ms
Result: fail
```

`Run at` is the UTC time the run started, ISO 8601 to the second, the same value as `started_at` in the JSON report. When the config file ignored at least one finding, the `Summary` line ends with the ignored count, for example `Summary: 1 errors, 1 warnings, 1 recommendations, 2 ignored`. Ignored findings are not in the group lines. `Elapsed` is wall clock time, in milliseconds below one second and in seconds above it. `Result` is always the last line. A group line appears only for a group with at least one finding.

### `--format <text|json|csv>`

- `text`: readable, one finding per line.
- `json`: full report. The header records `schema_version`, tool version, `started_at`, input, and the resolved check set. `schema_version` increments on any change that removes or renames a field. `ignored` lists the findings removed by the config `ignore` key, each with the fields of a finding and the `reason` of the entry that matched it.
- `csv`: one finding per row. Ignored findings are not included.

Default: `text`.

### `--output <folder>`

Write the report into a folder as `spyglass.report.txt`, `spyglass.report.json`, or `spyglass.report.csv` instead of stdout. The folder is created when missing. The file is always complete, whatever `--verbosity` says.

A `spyglass.report.txt` ends with the summary block, after the findings, never colored. `spyglass.report.json` and `spyglass.report.csv` are unchanged, because the JSON report already records `counts`, `counts_by_group`, and `passed`, and a CSV row has no column for a summary. The summary also goes to stderr on every run.

### `--verbosity <silent|summary|normal|verbose|debug>`

Controls stderr and the `text` report on stdout. A `json` or `csv` report on stdout is always complete.

- `silent`: nothing. Exit code only.
- `summary`: counts per severity and per group.
- `normal`: findings and summary.
- `verbose`: adds per check progress and timing.
- `debug`: adds discovery details.

Default: `normal`.

### `--no-color`

Disable ANSI colors on both streams.

Colored parts: the severity word on each finding, and in the summary block the counts and the `pass` or `fail` verdict. A count takes its severity color only when it is above zero. A zero count and `Run at` are gray. `Elapsed` uses the default color.

Each stream is decided separately. Findings on stdout are colored only when stdout is a terminal and `--output` is not set. The summary on stderr is colored only when stderr is a terminal.

## Listing checks

### `--list-rules`

Print one line per check with tab separated columns: ID, slug, default severity, effective severity with the override source in parentheses, status (`run` or `skip` followed by the skip reason), and description. Reads no content.

- Alone: the full catalog with defaults.
- With `check` and a content type, or a `contentType` in the config, and with `--layout`, `--config`, and `--skip`: the resolved set. Shows what would run and why each skipped check is skipped, including the config `reason`.

## Config file

JSON, comments allowed. Command line options override the config file. The config file overrides the defaults.

```json
{
    "contentType": "addon",
    "input": "build/validate",
    "failOn": "warning"
}
```

With this file in the current folder, `spyglass check` validates `build/validate` as an add-on.

A full example:

```json
{
    "skip": [
        "CHUNK",
        { "id": "PACK/301", "reason": "Sounds are referenced from scripts" },
        "TEXTURE/400-499"
    ],
    "severity": {
        "LANG": "warning",
        "DEFINITION/601": "error"
    },
    "ignore": [
        {
            "id": "PACK/301",
            "path": "RP/textures/entity/boss_phase_*.png",
            "reason": "Texture path is built at run time by scripts"
        }
    ],
    "failOn": "warning"
}
```

| Key | Value | Default | Option |
|---|---|---|---|
| `contentType` | One of `addon`, `world`, `skin`, `texture`, `persona`. | none | content type after `check` |
| `input` | String. Folder or packaged file to validate. | current folder | `--input` |
| `layout` | One of `standard`, `marketplace`. | `standard` | `--layout` |
| `output` | String. Folder for the report file. | stdout | `--output` |
| `format` | One of `text`, `json`, `csv`. | `text` | `--format` |
| `verbosity` | One of `silent`, `summary`, `normal`, `verbose`, `debug`. | `normal` | `--verbosity` |
| `noColor` | Boolean. | `false` | `--no-color` |
| `skip` | Array. Each entry is a selector string or an object with `id` and optional `reason`. Same selector forms as `--skip`. | none | `--skip` |
| `severity` | Object of ID or group to level. | none | `--severity` |
| `ignore` | Array of objects. Removes single findings. See [Ignoring findings](#ignoring-findings). | none | none |
| `failOn` | One of `error`, `warning`, `recommendation`, `none`. | `error` | `--fail-on` |

- `input` and `output` are relative to the folder of the config file, not the current folder. Paths given on the command line are relative to the current folder.
- `skip` and `severity` are combined with `--skip` and `--severity`. A `--severity` for the same ID wins.
- A key that is not in the table, or a key with a wrong type or value, is a usage error.
- `$schema` is also allowed, so an editor can load the JSON schema for the config file. The package contains it at `schema/spyglass.config.schema.json`. The schema lists every key with its allowed values and default.
- A config error is reported at the `--verbosity` given on the command line, or `normal` when none is given.

### Ignoring findings

`skip` removes a whole check. `ignore` removes only the findings that match an entry, and the check still runs. Use it for a finding that is correct for the content as written but not for how the content is used, such as a texture that only a script names.

| Field | Required | Matches |
|---|---|---|
| `id` | yes | Selector string, same forms as `--skip`. |
| `reason` | yes | Not matched. Text that says why. Must not be empty. |
| `path` | no | Pattern for the file path the finding reports. |
| `pack` | no | Pattern for the pack folder the finding reports. |
| `field` | no | Exact field path the finding reports. |

- A finding is ignored when its ID matches `id` and it matches every other field the entry gives. An entry with only `id` and `reason` ignores every finding of those checks.
- A finding without a path, pack, or field never matches an entry that gives that field.
- When two entries match a finding, the first one in the array gives the reason.
- Any field not in the table is an error, so a misspelled field never makes an entry match more findings.
- `path` and `pack` are relative to the input, with `/` between folders, the same text the report shows. `*` matches any characters except `/`, `**` matches any characters including `/`, `**/` also matches no folder, and `?` matches one character except `/`. `\` is read as `/`. Matching is case sensitive and covers the whole path.
- Ignored findings do not count for `--fail-on`, the counts, or the group lines. They are listed in the JSON report under `ignored` and printed at `--verbosity verbose`.
- An entry that ignored nothing in a run prints a notice to stderr, so an entry for a fixed or renamed file is found. There is no notice when none of the checks the entry selects ran.
- Unknown IDs are an error, as in `skip`.

## Environment

| Variable | Effect |
|---|---|
| `SPYGLASS_GAME_VERSION` | Current game version, for example `1.21.0`. Skips the online lookup. |
| `SPYGLASS_SKIP_NPM` | Any value. Skips the npm registry lookup used by `SCRIPT/501`. |

Both lookups have a ten second timeout and neither one stops the run. When the game version lookup fails, Spyglass prints a notice and uses the version of the vanilla samples tag it was built with, so `5xx` checks still run against slightly older data. When the npm lookup fails, Spyglass prints a notice and `SCRIPT/501` reports nothing. Set both variables to make a run fully offline.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Validation ran. No finding at or above `--fail-on`. |
| `1` | Validation ran. At least one finding at or above `--fail-on`. |
| `2` | Usage error. Unknown command, content type, or option, no content type for `check`, unknown ID in `--skip`, config does not parse, input path does not exist. Nothing was validated. |
| `3` | Tool error. Archive could not be read or opened, vanilla data could not be read, unexpected exception. No report is written. |

- Anything wrong inside the content is a finding, including a file that cannot be read (`FILE/207`). Only failures of the environment around the content are tool errors.
- `--fail-on none` never hides `2` or `3`.
- `--list-rules`, `--help`, and `--version` exit `0`.
- The stable interface is defined in [Contributing](contributing.md#versioning-and-releases). Text output may change between versions.
