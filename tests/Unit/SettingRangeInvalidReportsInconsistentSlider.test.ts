import assert from "node:assert/strict";
import { test } from "node:test";
import SettingRangeInvalidReportsInconsistentSlider from "../Helpers/SettingRangeInvalidReportsInconsistentSlider.js";

for (const entry of SettingRangeInvalidReportsInconsistentSlider.CASES) {
    test(SettingRangeInvalidReportsInconsistentSlider.ID + " " + entry.name, async () => {
        const result = await SettingRangeInvalidReportsInconsistentSlider.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
