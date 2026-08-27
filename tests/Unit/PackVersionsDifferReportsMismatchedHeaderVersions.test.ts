import assert from "node:assert/strict";
import { test } from "node:test";
import PackVersionsDifferReportsMismatchedHeaderVersions from "../Helpers/PackVersionsDifferReportsMismatchedHeaderVersions.js";

for (const entry of PackVersionsDifferReportsMismatchedHeaderVersions.CASES) {
    test(PackVersionsDifferReportsMismatchedHeaderVersions.ID + " " + entry.name, async () => {
        const result = await PackVersionsDifferReportsMismatchedHeaderVersions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
