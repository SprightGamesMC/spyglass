import assert from "node:assert/strict";
import { test } from "node:test";
import ResourcePackMissingReportsAddonWithoutResourceManifest from "../Helpers/ResourcePackMissingReportsAddonWithoutResourceManifest.js";

for (const entry of ResourcePackMissingReportsAddonWithoutResourceManifest.CASES) {
    test(ResourcePackMissingReportsAddonWithoutResourceManifest.ID + " " + entry.name, async () => {
        const found = await ResourcePackMissingReportsAddonWithoutResourceManifest.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
