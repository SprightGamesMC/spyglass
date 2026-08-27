import assert from "node:assert/strict";
import { test } from "node:test";
import PackNotReferencedReportsUnlistedPack from "../Helpers/PackNotReferencedReportsUnlistedPack.js";

for (const entry of PackNotReferencedReportsUnlistedPack.CASES) {
    test(PackNotReferencedReportsUnlistedPack.ID + " " + entry.name, async () => {
        const result = await PackNotReferencedReportsUnlistedPack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
