# Spyglass

Validation CLI for Minecraft Bedrock content. npm package `@sprightgames/spyglass`. Small model, stable check IDs, no editor, web, or world editing features.

## Docs are the spec

Read before changing code. Change the doc first, then the code.

- `docs/cli.md` command line, config file, exit codes.
- `docs/checks/README.md` ID format, categories, groups, content type to group lists.
- `docs/checks/<group>.md` every check. The summary table row must match the code. The section under it is the acceptance criteria.
- `docs/layouts.md` folder layouts per content type and `--layout`.
- `docs/contributing.md` architecture, how to add a check, tests, code conventions. Follow it exactly.

A check that does not match its doc is a bug in whichever one is wrong.

## Commands

`npm run lint`, `npm run fmt`, `npm test`, `npm run build`. Never edit `dist/`.

## Fixed rules

- One class per check, one unit test each with a pass and a fail case.
- IDs never change. Thresholds in `<Group>Limits.ts`. Severity fixed per check.
- No comments in `src/` or `tests/`. No `console.log`. No `else` after return.
- Nothing in `src/`, `tests/`, or `docs/` contains the name of another tool, project, or company. Only Minecraft data.
- No figurative language anywhere. Names, messages, docs, and test case names use literal words. Minecraft terms are the exception.
- Tool failures throw and exit `3`. Unreadable content files are `FILE/207`.
- Tests use `node:test` only. Fixtures are tiny. No count tests.
- Commits: `TYPE | Description` with `ADD`, `CHANGE`, or `FIX`.
