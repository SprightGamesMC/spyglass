import assert from "node:assert/strict";
import { test } from "node:test";
import NamePrefixMismatchReportsDifferentPrefixes from "../Helpers/NamePrefixMismatchReportsDifferentPrefixes.js";

for (const entry of NamePrefixMismatchReportsDifferentPrefixes.CASES) {
    test(NamePrefixMismatchReportsDifferentPrefixes.ID + " " + entry.name, async () => {
        const result = await NamePrefixMismatchReportsDifferentPrefixes.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
