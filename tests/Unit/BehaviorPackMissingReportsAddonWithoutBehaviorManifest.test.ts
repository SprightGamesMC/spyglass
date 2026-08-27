import assert from "node:assert/strict";
import { test } from "node:test";
import BehaviorPackMissingReportsAddonWithoutBehaviorManifest from "../Helpers/BehaviorPackMissingReportsAddonWithoutBehaviorManifest.js";

for (const entry of BehaviorPackMissingReportsAddonWithoutBehaviorManifest.CASES) {
    test(BehaviorPackMissingReportsAddonWithoutBehaviorManifest.ID + " " + entry.name, async () => {
        const found = await BehaviorPackMissingReportsAddonWithoutBehaviorManifest.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
