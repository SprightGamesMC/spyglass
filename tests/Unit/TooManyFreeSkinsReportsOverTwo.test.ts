import assert from "node:assert/strict";
import { test } from "node:test";
import TooManyFreeSkinsReportsOverTwo from "../Helpers/TooManyFreeSkinsReportsOverTwo.js";

for (const entry of TooManyFreeSkinsReportsOverTwo.CASES) {
    test(TooManyFreeSkinsReportsOverTwo.ID + " " + entry.name, async () => {
        const result = await TooManyFreeSkinsReportsOverTwo.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
