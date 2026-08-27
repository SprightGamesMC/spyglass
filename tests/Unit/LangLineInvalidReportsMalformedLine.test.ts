import assert from "node:assert/strict";
import { test } from "node:test";
import LangLineInvalidReportsMalformedLine from "../Helpers/LangLineInvalidReportsMalformedLine.js";

for (const entry of LangLineInvalidReportsMalformedLine.CASES) {
    test(LangLineInvalidReportsMalformedLine.ID + " " + entry.name, async () => {
        const result = await LangLineInvalidReportsMalformedLine.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
