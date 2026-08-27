import assert from "node:assert/strict";
import { test } from "node:test";
import PieceNameMismatchReportsNameDifference from "../Helpers/PieceNameMismatchReportsNameDifference.js";

for (const entry of PieceNameMismatchReportsNameDifference.CASES) {
    test(PieceNameMismatchReportsNameDifference.ID + " " + entry.name, async () => {
        const result = await PieceNameMismatchReportsNameDifference.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
