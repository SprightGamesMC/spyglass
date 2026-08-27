import assert from "node:assert/strict";
import { test } from "node:test";
import TextureNameNotLowercaseReportsUpperCaseFileName from "../Helpers/TextureNameNotLowercaseReportsUpperCaseFileName.js";

for (const entry of TextureNameNotLowercaseReportsUpperCaseFileName.CASES) {
    test(TextureNameNotLowercaseReportsUpperCaseFileName.ID + " " + entry.name, async () => {
        const result = await TextureNameNotLowercaseReportsUpperCaseFileName.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
