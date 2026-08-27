import assert from "node:assert/strict";
import { test } from "node:test";
import SizeOverLimitReportsAddonAboveByteLimit from "../Helpers/SizeOverLimitReportsAddonAboveByteLimit.js";

for (const entry of SizeOverLimitReportsAddonAboveByteLimit.CASES) {
    test(SizeOverLimitReportsAddonAboveByteLimit.ID + " " + entry.name, async () => {
        const found = await SizeOverLimitReportsAddonAboveByteLimit.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
