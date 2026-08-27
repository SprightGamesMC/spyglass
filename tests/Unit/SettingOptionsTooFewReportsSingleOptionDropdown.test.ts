import assert from "node:assert/strict";
import { test } from "node:test";
import SettingOptionsTooFewReportsSingleOptionDropdown from "../Helpers/SettingOptionsTooFewReportsSingleOptionDropdown.js";

for (const entry of SettingOptionsTooFewReportsSingleOptionDropdown.CASES) {
    test(SettingOptionsTooFewReportsSingleOptionDropdown.ID + " " + entry.name, async () => {
        const result = await SettingOptionsTooFewReportsSingleOptionDropdown.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
