import assert from "node:assert/strict";
import { test } from "node:test";
import CapeNotAllowedReportsSkinWithCape from "../Helpers/CapeNotAllowedReportsSkinWithCape.js";

for (const entry of CapeNotAllowedReportsSkinWithCape.CASES) {
    test(CapeNotAllowedReportsSkinWithCape.ID + " " + entry.name, async () => {
        const result = await CapeNotAllowedReportsSkinWithCape.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
