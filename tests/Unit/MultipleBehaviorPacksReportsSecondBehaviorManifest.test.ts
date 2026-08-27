import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleBehaviorPacksReportsSecondBehaviorManifest from "../Helpers/MultipleBehaviorPacksReportsSecondBehaviorManifest.js";

for (const entry of MultipleBehaviorPacksReportsSecondBehaviorManifest.CASES) {
    test(MultipleBehaviorPacksReportsSecondBehaviorManifest.ID + " " + entry.name, async () => {
        const found = await MultipleBehaviorPacksReportsSecondBehaviorManifest.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
