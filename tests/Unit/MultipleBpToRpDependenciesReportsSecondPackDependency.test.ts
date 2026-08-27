import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleBpToRpDependenciesReportsSecondPackDependency from "../Helpers/MultipleBpToRpDependenciesReportsSecondPackDependency.js";

for (const entry of MultipleBpToRpDependenciesReportsSecondPackDependency.CASES) {
    test(MultipleBpToRpDependenciesReportsSecondPackDependency.ID + " " + entry.name, async () => {
        const found = await MultipleBpToRpDependenciesReportsSecondPackDependency.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
