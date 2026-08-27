import assert from "node:assert/strict";
import { test } from "node:test";
import RpToBpDependencyMismatchReportsUuidNotBehaviorPack from "../Helpers/RpToBpDependencyMismatchReportsUuidNotBehaviorPack.js";

for (const entry of RpToBpDependencyMismatchReportsUuidNotBehaviorPack.CASES) {
    test(RpToBpDependencyMismatchReportsUuidNotBehaviorPack.ID + " " + entry.name, async () => {
        const result = await RpToBpDependencyMismatchReportsUuidNotBehaviorPack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.fields, entry.expectedFields);
    });
}
