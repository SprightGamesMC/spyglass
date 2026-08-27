# PARTICLE

Rules that apply only to particle effect files in the `particles` folder of a resource pack. The version field is checked by [DEFINITION](definition.md).

Runs for: addon, world, texture.

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| PARTICLE/201 | identifier-not-namespaced | error | Identifier is not `namespace:name` |

## PARTICLE/201 identifier-not-namespaced

`description.identifier` must have the form `namespace:name`, with 2 or more word characters in the namespace and 1 or more in the name. A missing identifier string is also reported. Runs only when `format_version` is `1.20.60` or higher.

Fix: set `description.identifier` to a namespaced value that uses your own namespace.
