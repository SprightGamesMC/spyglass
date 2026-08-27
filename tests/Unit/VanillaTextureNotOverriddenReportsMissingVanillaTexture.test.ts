import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import VanillaTextureNotOverriddenReportsMissingVanillaTexture from "../Helpers/VanillaTextureNotOverriddenReportsMissingVanillaTexture.js";

for (const entry of VanillaTextureNotOverriddenReportsMissingVanillaTexture.CASES) {
    test(VanillaTextureNotOverriddenReportsMissingVanillaTexture.ID + " " + entry.name, async () => {
        const findings = await VanillaTextureNotOverriddenReportsMissingVanillaTexture.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (findings.length > 0) {
            assert.match(findings[0].message, /textures\/blocks\/dirt/);
        }
    });
}
