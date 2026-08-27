import assert from "node:assert/strict";
import { test } from "node:test";
import LocKeyMissingReportsKeyAbsentFromEnglishLang from "../Helpers/LocKeyMissingReportsKeyAbsentFromEnglishLang.js";

for (const entry of LocKeyMissingReportsKeyAbsentFromEnglishLang.CASES) {
    test(LocKeyMissingReportsKeyAbsentFromEnglishLang.ID + " " + entry.name, async () => {
        const result = await LocKeyMissingReportsKeyAbsentFromEnglishLang.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
