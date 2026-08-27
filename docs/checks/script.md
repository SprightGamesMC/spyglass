# SCRIPT

Commands and script settings in behavior packs: `.mcfunction` files, command lists inside other definition files, script module versions in the manifest, and the beta feature flag.

Runs for: addon, world.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| SCRIPT/201 | unknown-command | error | Command is not a built in command |
| SCRIPT/202 | mcfunction-leading-slash | warning | .mcfunction line begins with `/` |
| SCRIPT/501 | beta-module-outdated | error | Dependency uses a beta version older than the current beta |
| SCRIPT/502 | function-engine-version-too-low | error | Pack has functions with min_engine_version below 1.8.0 |
| SCRIPT/701 | use-beta-features | error | use_beta_features is true |

## SCRIPT/201 unknown-command

A command name is not in the list of built in Minecraft commands. Commands are read from `.mcfunction` files, dialogue files, and the event command lists in animation and animation controller files. From dialogue and animation files only strings that start with a slash are read. Namespaced commands are not checked.

Fix: correct the command name, or remove the command.

## SCRIPT/202 mcfunction-leading-slash

A line in a `.mcfunction` file starts with `/`. Blank lines are ignored.

Fix: remove the leading `/`.

## SCRIPT/501 beta-module-outdated

A script module dependency whose version contains `-beta` does not start with the current beta version of that module. The current beta version comes from the npm registry, so this check needs network access. Without it the check reports nothing.

Fix: update the module `version` in `dependencies` to the current beta version, or switch to a stable version.

## SCRIPT/502 function-engine-version-too-low

A behavior pack contains `.mcfunction` files and its `header.min_engine_version` is below `1.8.0`, the version that added functions. A pack with no `min_engine_version` is reported by MANIFEST/101 instead.

Fix: raise `min_engine_version` to at least `[1, 8, 0]`, or remove the functions.

## SCRIPT/701 use-beta-features

`use_beta_features` is `true`. Checked in behavior pack manifests and in entity, block, and item behavior files.

Fix: remove the field or set it to `false`, then replace any feature that depended on it with a released one.
