import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import ResourcePackMissingReportsTexturePackWithoutResourceManifest from "../Helpers/ResourcePackMissingReportsTexturePackWithoutResourceManifest.js";

for (const entry of ResourcePackMissingReportsTexturePackWithoutResourceManifest.CASES) {
    test(ResourcePackMissingReportsTexturePackWithoutResourceManifest.ID + " " + entry.name, async () => {
        const findings = await ResourcePackMissingReportsTexturePackWithoutResourceManifest.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);
    });
}
