import assert from "node:assert/strict";
import { test } from "node:test";
import BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependency from "../Helpers/BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependency.js";

for (const entry of BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependency.CASES) {
    test(BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependency.ID + " " + entry.name, async () => {
        const found = await BpToRpDependencyMissingReportsBehaviorPackWithoutPackDependency.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
