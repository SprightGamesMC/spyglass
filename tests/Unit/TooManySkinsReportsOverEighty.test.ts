import assert from "node:assert/strict";
import { test } from "node:test";
import TooManySkinsReportsOverEighty from "../Helpers/TooManySkinsReportsOverEighty.js";

for (const entry of TooManySkinsReportsOverEighty.CASES) {
    test(TooManySkinsReportsOverEighty.ID + " " + entry.name, async () => {
        const result = await TooManySkinsReportsOverEighty.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
