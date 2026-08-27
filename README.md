# Spyglass

Validation CLI for Minecraft Bedrock content. Checks add-ons, world templates, skin packs, texture packs, persona pieces, and emotes, and reports every problem with a stable ID such as `MANIFEST/601`.

## Install

Node 20 or later.

```
npm install --global @sprightgames/spyglass
```

Or run without installing:

```
npx @sprightgames/spyglass addon --input ./MyAddon
```

## Use

```
spyglass addon --input ./MyAddon
spyglass world --input ./MyWorld.mctemplate
spyglass skin --input ./MySkins --layout marketplace --fail-on warning
spyglass --list-rules
```

The first argument is the content type: `addon`, `world`, `skin`, `texture`, or `persona`. `--input` takes a folder, a `.mcaddon`, `.mctemplate`, `.mcworld`, `.mcpack`, `.mcpersona`, or a `.zip`.

The exit code is `0` when nothing at or above `--fail-on` was found and `1` otherwise, so the command can be used directly in CI to block a build.

## Docs

- [Getting started](https://github.com/SprightGamesMC/spyglass/blob/main/docs/getting-started.md)
- [Command line](https://github.com/SprightGamesMC/spyglass/blob/main/docs/cli.md) options, config file, output formats, exit codes
- [Checks](https://github.com/SprightGamesMC/spyglass/blob/main/docs/checks/README.md) every check by group, with what it checks and how to fix it
- [Layouts](https://github.com/SprightGamesMC/spyglass/blob/main/docs/layouts.md) the folder structure of each content type
- [Contributing](https://github.com/SprightGamesMC/spyglass/blob/main/docs/contributing.md) architecture and how to add a check

## License

MIT
