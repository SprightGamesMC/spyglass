import assert from "node:assert/strict";
import { test } from "node:test";
import LangKeyDuplicateReportsRepeatedKey from "../Helpers/LangKeyDuplicateReportsRepeatedKey.js";

for (const entry of LangKeyDuplicateReportsRepeatedKey.CASES) {
    test(LangKeyDuplicateReportsRepeatedKey.ID + " " + entry.name, async () => {
        const result = await LangKeyDuplicateReportsRepeatedKey.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
