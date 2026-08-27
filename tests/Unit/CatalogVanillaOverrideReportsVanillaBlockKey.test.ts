import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import CatalogVanillaOverrideReportsVanillaBlockKey from "../Helpers/CatalogVanillaOverrideReportsVanillaBlockKey.js";

for (const entry of CatalogVanillaOverrideReportsVanillaBlockKey.CASES) {
    test(CatalogVanillaOverrideReportsVanillaBlockKey.ID + " " + entry.name, async () => {
        const findings = await CatalogVanillaOverrideReportsVanillaBlockKey.run(entry);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedKeys].sort());

        for (const finding of findings) {
            assert.equal(finding.id, CatalogVanillaOverrideReportsVanillaBlockKey.ID);
            assert.equal(finding.path, CatalogVanillaOverrideReportsVanillaBlockKey.CATALOG_PATH);
            assert.equal(finding.pack, "RP");
        }
    });
}
