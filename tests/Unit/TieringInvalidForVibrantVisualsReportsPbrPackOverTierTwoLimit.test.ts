import assert from "node:assert/strict";
import { test } from "node:test";
import TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimit from "../Helpers/TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimit.js";

for (const entry of TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimit.CASES) {
    test(TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimit.ID + " " + entry.name, async () => {
        const result = await TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimit.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
