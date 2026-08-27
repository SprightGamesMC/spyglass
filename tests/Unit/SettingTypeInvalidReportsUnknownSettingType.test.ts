import assert from "node:assert/strict";
import { test } from "node:test";
import SettingTypeInvalidReportsUnknownSettingType from "../Helpers/SettingTypeInvalidReportsUnknownSettingType.js";

for (const entry of SettingTypeInvalidReportsUnknownSettingType.CASES) {
    test(SettingTypeInvalidReportsUnknownSettingType.ID + " " + entry.name, async () => {
        const result = await SettingTypeInvalidReportsUnknownSettingType.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
