# CHUNK

Saved chunk data of a world: the database in the `db` folder, including custom dimension mappings and command block contents.

Runs for: world.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| CHUNK/101 | dimension-table-missing | error | Custom dimension chunk data with no DimensionNameIdTable |
| CHUNK/201 | unknown-command | error | Command block command is not a built in command |
| CHUNK/301 | dimension-mapping-unclaimed | warning | DimensionNameIdTable entry with no chunk data |
| CHUNK/501 | command-from-older-version | recommendation | Command block command is from a version older than 1.20.0 |

## CHUNK/101 dimension-table-missing

The world has chunk data for a custom dimension but no `DimensionNameIdTable` key. Custom dimension ids start at 1000.

Fix: open and save the world in a game version that supports the dimension so the entry is written, or remove the chunk data.

## CHUNK/201 unknown-command

A command block contains a command that is not a built in command. Namespaced commands are not checked, because script API commands are always namespaced. Every record is scanned, with no limit.

Fix: replace the command with a valid built in command. Use `--skip CHUNK` when the scan of a very large world is too slow.

## CHUNK/301 dimension-mapping-unclaimed

`DimensionNameIdTable` has an entry for a custom dimension with no chunk data. Ids below 1000 are not checked.

Fix: remove the unused dimension, or visit it in the game so chunk data is generated.

## CHUNK/501 command-from-older-version

A command block command was saved with a command version older than 1.20.0. Command version 33 corresponds to 1.20.0. Every record is scanned, with no limit.

Fix: open each reported command block in a current game version and save it again. Use `--skip CHUNK` when the scan of a very large world is too slow.
