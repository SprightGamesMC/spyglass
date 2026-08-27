import assert from "node:assert/strict";
import { test } from "node:test";
import CheckSetResolverAppliesSkipsAndOverrides from "../Helpers/CheckSetResolverAppliesSkipsAndOverrides.js";

test("skin content type keeps FILE and SKIN and skips MANIFEST/105 excluded for skin and ADDON that applies to addon content", () => {
    const resolved = CheckSetResolverAppliesSkipsAndOverrides.resolveWithoutConfig("skin", "standard");

    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "FILE/201").skipped, false);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "SKIN/101").skipped, false);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "MANIFEST/105").skipped, true);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "ADDON/101").skipped, true);
});

test("addon content type enables ADDON in the marketplace layout and ART/108 runs only for persona content", () => {
    const addon = CheckSetResolverAppliesSkipsAndOverrides.resolveWithoutConfig("addon", "marketplace");
    const persona = CheckSetResolverAppliesSkipsAndOverrides.resolveWithoutConfig("persona", "marketplace");

    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(addon, "ADDON/101").skipped, false);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(addon, "ART/108").skipped, true);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(persona, "ART/108").skipped, false);
});

test("config skip FILE/401 and --skip MANIFEST each record their own skip reason", () => {
    const config = { skips: [{ selector: { group: "FILE", numbers: [401] }, reason: "legacy paths" }], severityOverrides: [] };
    const resolved = CheckSetResolverAppliesSkipsAndOverrides.resolve("addon", "standard", config, [{ group: "MANIFEST" }], []);

    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "FILE/401").skipReason, "skipped by config: legacy paths");
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "MANIFEST/105").skipReason, "skipped by --skip");
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "FILE/201").skipped, false);
});

test("command line override on FILE/201 takes priority over the config FILE group override that still applies to FILE/401", () => {
    const config = { skips: [], severityOverrides: [{ target: "FILE", severity: "warning" as const }] };
    const resolved = CheckSetResolverAppliesSkipsAndOverrides.resolve(
        "addon",
        "standard",
        config,
        [],
        [{ target: "FILE/201", severity: "recommendation" }]
    );

    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "FILE/201").severity, "recommendation");
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "FILE/201").overrideSource, "command line");
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "FILE/401").severity, "warning");
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.find(resolved, "FILE/401").overrideSource, "config");
});

test("unknown group NOPE, number FILE/999, and override target FILE/999 are rejected while range FILE 400 to 499 is accepted", () => {
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.resolveThrows([{ group: "NOPE" }], []), true);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.resolveThrows([{ group: "FILE", numbers: [999] }], []), true);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.resolveThrows([], [{ target: "FILE/999", severity: "error" }]), true);
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.resolveThrows([{ group: "FILE", from: 400, to: 499 }], []), false);
});

test("range FILE 900 to 999 matches no check so it is rejected", () => {
    assert.equal(CheckSetResolverAppliesSkipsAndOverrides.resolveThrows([{ group: "FILE", from: 900, to: 999 }], []), true);
});
