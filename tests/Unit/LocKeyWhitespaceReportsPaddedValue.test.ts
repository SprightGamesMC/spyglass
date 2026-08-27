import assert from "node:assert/strict";
import { test } from "node:test";
import LocKeyWhitespaceReportsPaddedValue from "../Helpers/LocKeyWhitespaceReportsPaddedValue.js";

for (const entry of LocKeyWhitespaceReportsPaddedValue.CASES) {
    test(LocKeyWhitespaceReportsPaddedValue.ID + " " + entry.name, async () => {
        const result = await LocKeyWhitespaceReportsPaddedValue.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
