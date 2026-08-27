import assert from "node:assert/strict";
import { test } from "node:test";
import RpToBpDependencyMissingReportsResourcePackWithoutDependency from "../Helpers/RpToBpDependencyMissingReportsResourcePackWithoutDependency.js";

for (const entry of RpToBpDependencyMissingReportsResourcePackWithoutDependency.CASES) {
    test(RpToBpDependencyMissingReportsResourcePackWithoutDependency.ID + " " + entry.name, async () => {
        const found = await RpToBpDependencyMissingReportsResourcePackWithoutDependency.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
