import assert from "node:assert/strict";
import { test } from "node:test";
import MaterialIdentifierInvalidReportsGenericFirstSegment from "../Helpers/MaterialIdentifierInvalidReportsGenericFirstSegment.js";

for (const entry of MaterialIdentifierInvalidReportsGenericFirstSegment.CASES) {
    test(MaterialIdentifierInvalidReportsGenericFirstSegment.ID + " " + entry.name, async () => {
        const result = await MaterialIdentifierInvalidReportsGenericFirstSegment.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
