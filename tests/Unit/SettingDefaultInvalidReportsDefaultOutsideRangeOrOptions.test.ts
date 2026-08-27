import assert from "node:assert/strict";
import { test } from "node:test";
import SettingDefaultInvalidReportsDefaultOutsideRangeOrOptions from "../Helpers/SettingDefaultInvalidReportsDefaultOutsideRangeOrOptions.js";

for (const entry of SettingDefaultInvalidReportsDefaultOutsideRangeOrOptions.CASES) {
    test(SettingDefaultInvalidReportsDefaultOutsideRangeOrOptions.ID + " " + entry.name, async () => {
        const result = await SettingDefaultInvalidReportsDefaultOutsideRangeOrOptions.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
