import assert from "node:assert/strict";
import { test } from "node:test";
import OverridesProtectedVanillaAssetReportsSulfurSpringStructure from "../Helpers/OverridesProtectedVanillaAssetReportsSulfurSpringStructure.js";

for (const entry of OverridesProtectedVanillaAssetReportsSulfurSpringStructure.CASES) {
    test(OverridesProtectedVanillaAssetReportsSulfurSpringStructure.ID + " " + entry.name, async () => {
        const findings = await OverridesProtectedVanillaAssetReportsSulfurSpringStructure.run(entry.packType, entry.packPath);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, OverridesProtectedVanillaAssetReportsSulfurSpringStructure.ID);
            assert.equal(findings[0].path, OverridesProtectedVanillaAssetReportsSulfurSpringStructure.ROOT + "/" + entry.packPath);
        }
    });
}
