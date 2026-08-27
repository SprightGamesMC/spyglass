# Getting started

## Install

Spyglass needs Node 20 or later.

```
npm install --global @sprightgames/spyglass
```

`npx @sprightgames/spyglass` works too and needs no install.

## First run

Give it the path to your content and name the content type.

```
spyglass addon --input ./MyAddon
```

Content types: `addon`, `world`, `skin`, `texture`, `persona`.

`--input` accepts a folder or a packaged file. Packaged files are `.mcaddon`, `.mctemplate`, `.mcworld`, `.mcpack`, `.mcpersona`, and `.zip`. When `--input` is left out the current folder is used.

Packs are found by searching for `manifest.json`, so folder names do not matter. A pack in the wrong place is still validated.

## Reading the report

Each finding is one line.

```
error MANIFEST/601 uuid-duplicate [RP_MyPack/manifest.json header.uuid]: uuid 1234... is used more than once in header, modules, or dependencies
```

Left to right: severity, check ID, slug, file with an optional line and field in brackets, then the message after the colon. Find the ID in [Checks](checks/README.md) for what the check means and how to fix it.

Severity is `error`, `warning`, or `recommendation`, fixed per check. See [Checks](checks/README.md#severity). The run ends with a count per severity and per group.

## Making it fail

Spyglass exits `1` when any finding is at or above `--fail-on`. The default is `error`.

```
spyglass world --input ./MyWorld.zip --layout marketplace --fail-on warning
```

That is the usual setting for a Marketplace submission. See [Command line](cli.md) for `--skip`, the config file, and machine readable output.

## Marketplace submissions

Add `--layout marketplace` when the input is a submission zip. That turns on the [MARKETPLACE](checks/marketplace.md) and [ART](checks/art.md) groups, which check folder names, pack folder acronyms, and the Marketing Art and Store Art files. See [Layouts](layouts.md) for the expected structure.

## In CI

```
npx @sprightgames/spyglass addon --input ./MyAddon --fail-on warning --format json --output ./reports
```

Report goes to stdout by default. Progress and the summary go to stderr, so `> report.txt` gives a file with only the report. `--output` writes the report into a folder instead.

Two environment variables are useful in CI:

- `SPYGLASS_GAME_VERSION=1.21.0` sets the current game version instead of fetching it. Without it Spyglass looks the version up online once per run.
- `SPYGLASS_SKIP_NPM=1` skips the npm registry lookup used by `SCRIPT/501`.

Neither lookup can stop a run. Without network access Spyglass prints a notice, falls back to the game version of the vanilla data it was built with, and reports nothing for `SCRIPT/501`. Set both variables to skip the lookups entirely.

Exit codes: `0` pass, `1` findings at or above `--fail-on`, `2` bad arguments, `3` the tool could not finish. Details in [Command line](cli.md#exit-codes). The stable interface is defined in [Contributing](contributing.md#versioning-and-releases).
