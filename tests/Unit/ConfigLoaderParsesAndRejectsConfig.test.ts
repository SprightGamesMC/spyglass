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
