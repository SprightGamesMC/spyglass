import assert from "node:assert/strict";
import { test } from "node:test";
import VanillaContentOverrideReportsVanillaPath from "../Helpers/VanillaContentOverrideReportsVanillaPath.js";

for (const entry of VanillaContentOverrideReportsVanillaPath.CASES) {
    test(VanillaContentOverrideReportsVanillaPath.ID + " " + entry.name, async () => {
        const result = await VanillaContentOverrideReportsVanillaPath.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
