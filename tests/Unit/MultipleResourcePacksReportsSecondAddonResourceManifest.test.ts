import assert from "node:assert/strict";
import { test } from "node:test";
import MultipleResourcePacksReportsSecondAddonResourceManifest from "../Helpers/MultipleResourcePacksReportsSecondAddonResourceManifest.js";

for (const entry of MultipleResourcePacksReportsSecondAddonResourceManifest.CASES) {
    test(MultipleResourcePacksReportsSecondAddonResourceManifest.ID + " " + entry.name, async () => {
        const found = await MultipleResourcePacksReportsSecondAddonResourceManifest.run(entry);

        assert.deepEqual(found, entry.expectedIds);
    });
}
