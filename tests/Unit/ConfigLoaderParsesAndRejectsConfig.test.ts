import assert from "node:assert/strict";
import { test } from "node:test";
import ConfigLoaderParsesAndRejectsConfig from "../Helpers/ConfigLoaderParsesAndRejectsConfig.js";

for (const entry of ConfigLoaderParsesAndRejectsConfig.CASES) {
    test("config " + entry.name, () => {
        const parsed = ConfigLoaderParsesAndRejectsConfig.parse(entry.value);

        assert.equal(parsed !== undefined, entry.valid);
    });
}

test("config fields map to skips, overrides, and fail level", () => {
    const parsed = ConfigLoaderParsesAndRejectsConfig.parse({
        skip: ["TEXTURE", { id: "CHUNK", reason: "slow" }],
        severity: { "DEFINITION/601": "error" },
        failOn: "warning",
    });

    assert.deepEqual(parsed?.skips, [{ selector: { group: "TEXTURE" } }, { selector: { group: "CHUNK" }, reason: "slow" }]);
    assert.deepEqual(parsed?.severityOverrides, [{ target: "DEFINITION/601", severity: "error" }]);
    assert.equal(parsed?.failOn, "warning");
});

test("config ignore entry keeps its id text, selector, reason, and only the match fields it gives", () => {
    const parsed = ConfigLoaderParsesAndRejectsConfig.parse({ ignore: [{ id: "PACK/301", pack: "RP", reason: "named by a script" }] });

    assert.deepEqual(parsed?.ignores[0], {
        id: "PACK/301",
        selector: { group: "PACK", numbers: [301] },
        reason: "named by a script",
        pack: "RP",
    });
});

test("config at sub/spyglass.config.json resolves input build to sub/build and output reports to sub/reports", () => {
    const paths = ConfigLoaderParsesAndRejectsConfig.resolvedPaths();

    assert.equal(paths.input, paths.expectedInput);
    assert.equal(paths.output, paths.expectedOutput);
});
