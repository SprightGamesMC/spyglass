import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import EntityMinecraftRuntimeIdentifierReportsVanillaPrefix from "../Helpers/EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.js";

for (const entry of EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.CASES) {
    test(EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.ID + " " + entry.name, async () => {
        const findings = await EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.run(entry.description);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectFinding ? [EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.ID] : []);

        for (const finding of findings) {
            assert.equal(finding.path, EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.PATH);
            assert.equal(finding.location?.field, "minecraft:entity.description.runtime_identifier");
        }
    });
}

test(EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.ID + " excludes the addon content type, see ADDON/212", () => {
    assert.deepEqual(EntityMinecraftRuntimeIdentifierReportsVanillaPrefix.excludedContentTypes(), ["addon"]);
});
