import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import AddonCatalogVanillaOverrideReportsVanillaBlockKey from "../Helpers/AddonCatalogVanillaOverrideReportsVanillaBlockKey.js";

for (const entry of AddonCatalogVanillaOverrideReportsVanillaBlockKey.CASES) {
    test(AddonCatalogVanillaOverrideReportsVanillaBlockKey.ID + " " + entry.name, async () => {
        const findings = await AddonCatalogVanillaOverrideReportsVanillaBlockKey.run(entry);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedKeys].sort());

        for (const finding of findings) {
            assert.equal(finding.id, AddonCatalogVanillaOverrideReportsVanillaBlockKey.ID);
            assert.equal(finding.severity, "error");
        }
    });
}

test(AddonCatalogVanillaOverrideReportsVanillaBlockKey.ID + " replaces BLOCK/601 for the addon content type", () => {
    assert.deepEqual(AddonCatalogVanillaOverrideReportsVanillaBlockKey.blockGroupExcludedContentTypes(), ["texture", "addon"]);
});
