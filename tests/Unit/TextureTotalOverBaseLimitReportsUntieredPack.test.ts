import assert from "node:assert/strict";
import { test } from "node:test";
import TextureTotalOverBaseLimitReportsUntieredPack from "../Helpers/TextureTotalOverBaseLimitReportsUntieredPack.js";

for (const entry of TextureTotalOverBaseLimitReportsUntieredPack.CASES) {
    test(TextureTotalOverBaseLimitReportsUntieredPack.ID + " " + entry.name, async () => {
        const result = await TextureTotalOverBaseLimitReportsUntieredPack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
    });
}
