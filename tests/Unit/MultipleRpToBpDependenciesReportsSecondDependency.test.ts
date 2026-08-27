import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleRpToBpDependenciesReportsSecondDependency from "../Helpers/MultipleRpToBpDependenciesReportsSecondDependency.js";

for (const entry of MultipleRpToBpDependenciesReportsSecondDependency.CASES) {
    test(MultipleRpToBpDependenciesReportsSecondDependency.ID + " " + entry.name, async () => {
        const found = await MultipleRpToBpDependenciesReportsSecondDependency.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
