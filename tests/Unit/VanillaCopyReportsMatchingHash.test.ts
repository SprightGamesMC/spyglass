import assert from "node:assert/strict";
import { test } from "node:test";
import VanillaCopyReportsMatchingHash from "../Helpers/VanillaCopyReportsMatchingHash.js";

for (const entry of VanillaCopyReportsMatchingHash.CASES) {
    test(VanillaCopyReportsMatchingHash.ID + " " + entry.name, async () => {
        const result = await VanillaCopyReportsMatchingHash.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
        assert.deepEqual(result.fields, [...entry.expectedFields]);
    });
}

test(VanillaCopyReportsMatchingHash.ID + " is excluded for the texture and addon content types", () => {
    assert.deepEqual(VanillaCopyReportsMatchingHash.excludedContentTypes(), ["texture", "addon"]);
});
