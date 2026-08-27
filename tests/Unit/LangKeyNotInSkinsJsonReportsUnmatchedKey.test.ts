import assert from "node:assert/strict";
import { test } from "node:test";
import LangKeyNotInSkinsJsonReportsUnmatchedKey from "../Helpers/LangKeyNotInSkinsJsonReportsUnmatchedKey.js";

for (const entry of LangKeyNotInSkinsJsonReportsUnmatchedKey.CASES) {
    test(LangKeyNotInSkinsJsonReportsUnmatchedKey.ID + " " + entry.name, async () => {
        const result = await LangKeyNotInSkinsJsonReportsUnmatchedKey.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
