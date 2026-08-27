import assert from "node:assert/strict";
import { test } from "node:test";
import IdentifierNotNamespacedReportsSegmentWithoutNamespace from "../Helpers/IdentifierNotNamespacedReportsSegmentWithoutNamespace.js";

for (const entry of IdentifierNotNamespacedReportsSegmentWithoutNamespace.CASES) {
    test(IdentifierNotNamespacedReportsSegmentWithoutNamespace.ID + " " + entry.name, async () => {
        const found = await IdentifierNotNamespacedReportsSegmentWithoutNamespace.run(entry);

        assert.deepEqual(found, entry.expectedFields);
    });
}
