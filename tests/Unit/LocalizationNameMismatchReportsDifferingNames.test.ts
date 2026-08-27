import assert from "node:assert/strict";
import { test } from "node:test";
import LocalizationNameMismatchReportsDifferingNames from "../Helpers/LocalizationNameMismatchReportsDifferingNames.js";

for (const entry of LocalizationNameMismatchReportsDifferingNames.CASES) {
    test(LocalizationNameMismatchReportsDifferingNames.ID + " " + entry.name, async () => {
        const result = await LocalizationNameMismatchReportsDifferingNames.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
