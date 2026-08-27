import assert from "node:assert/strict";
import { test } from "node:test";
import PurchaseTypeInvalidReportsUnknownType from "../Helpers/PurchaseTypeInvalidReportsUnknownType.js";

for (const entry of PurchaseTypeInvalidReportsUnknownType.CASES) {
    test(PurchaseTypeInvalidReportsUnknownType.ID + " " + entry.name, async () => {
        const result = await PurchaseTypeInvalidReportsUnknownType.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
