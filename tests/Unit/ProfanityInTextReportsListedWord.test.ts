import assert from "node:assert/strict";
import { test } from "node:test";
import ProfanityInTextReportsListedWord from "../Helpers/ProfanityInTextReportsListedWord.js";

for (const entry of ProfanityInTextReportsListedWord.CASES) {
    test(ProfanityInTextReportsListedWord.ID + " " + entry.name, async () => {
        const result = await ProfanityInTextReportsListedWord.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
