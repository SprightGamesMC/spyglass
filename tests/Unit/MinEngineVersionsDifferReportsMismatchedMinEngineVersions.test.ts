import assert from "node:assert/strict";
import { test } from "node:test";
import MinEngineVersionsDifferReportsMismatchedMinEngineVersions from "../Helpers/MinEngineVersionsDifferReportsMismatchedMinEngineVersions.js";

for (const entry of MinEngineVersionsDifferReportsMismatchedMinEngineVersions.CASES) {
    test(MinEngineVersionsDifferReportsMismatchedMinEngineVersions.ID + " " + entry.name, async () => {
        const result = await MinEngineVersionsDifferReportsMismatchedMinEngineVersions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
