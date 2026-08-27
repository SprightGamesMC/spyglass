import assert from "node:assert/strict";
import { test } from "node:test";
import BehaviorPackHasPackScopeReportsDeclaredScope from "../Helpers/BehaviorPackHasPackScopeReportsDeclaredScope.js";

for (const entry of BehaviorPackHasPackScopeReportsDeclaredScope.CASES) {
    test(BehaviorPackHasPackScopeReportsDeclaredScope.ID + " " + entry.name, async () => {
        const result = await BehaviorPackHasPackScopeReportsDeclaredScope.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
