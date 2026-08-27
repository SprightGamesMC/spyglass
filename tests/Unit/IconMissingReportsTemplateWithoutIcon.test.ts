import assert from "node:assert/strict";
import { test } from "node:test";
import IconMissingReportsTemplateWithoutIcon from "../Helpers/IconMissingReportsTemplateWithoutIcon.js";

for (const entry of IconMissingReportsTemplateWithoutIcon.CASES) {
    test(IconMissingReportsTemplateWithoutIcon.ID + " " + entry.name, async () => {
        const result = await IconMissingReportsTemplateWithoutIcon.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
