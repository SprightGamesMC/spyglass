import assert from "node:assert/strict";
import { test } from "node:test";
import UseBetaFeaturesReportsTrueFlag from "../Helpers/UseBetaFeaturesReportsTrueFlag.js";

for (const entry of UseBetaFeaturesReportsTrueFlag.CASES) {
    test(UseBetaFeaturesReportsTrueFlag.ID + " " + entry.name, async () => {
        const result = await UseBetaFeaturesReportsTrueFlag.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
        assert.deepEqual(result.fields, [...entry.expectedFields]);
    });
}
