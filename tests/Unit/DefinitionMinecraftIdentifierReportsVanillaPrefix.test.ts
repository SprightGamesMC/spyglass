import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DefinitionMinecraftIdentifierReportsVanillaPrefix from "../Helpers/DefinitionMinecraftIdentifierReportsVanillaPrefix.js";

for (const entry of DefinitionMinecraftIdentifierReportsVanillaPrefix.CASES) {
    test(DefinitionMinecraftIdentifierReportsVanillaPrefix.ID + " " + entry.name, async () => {
        const findings = await DefinitionMinecraftIdentifierReportsVanillaPrefix.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectFinding ? [DefinitionMinecraftIdentifierReportsVanillaPrefix.ID] : []);

        for (const finding of findings) {
            assert.equal(finding.path, entry.path);
            assert.equal(finding.location?.field, entry.rootKey + ".description.identifier");
        }
    });
}

test(DefinitionMinecraftIdentifierReportsVanillaPrefix.ID + " excludes the addon content type, see ADDON/207", () => {
    assert.deepEqual(DefinitionMinecraftIdentifierReportsVanillaPrefix.excludedContentTypes(), ["addon"]);
});
