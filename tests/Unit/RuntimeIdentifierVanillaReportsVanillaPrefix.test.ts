import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import RuntimeIdentifierVanillaReportsVanillaPrefix from "../Helpers/RuntimeIdentifierVanillaReportsVanillaPrefix.js";

for (const entry of RuntimeIdentifierVanillaReportsVanillaPrefix.CASES) {
    test(RuntimeIdentifierVanillaReportsVanillaPrefix.ID + " " + entry.name, async () => {
        const findings = await RuntimeIdentifierVanillaReportsVanillaPrefix.run(entry.description);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectFinding ? [RuntimeIdentifierVanillaReportsVanillaPrefix.ID] : []);

        for (const finding of findings) {
            assert.equal(finding.path, RuntimeIdentifierVanillaReportsVanillaPrefix.PATH);
            assert.equal(finding.severity, "error");
            assert.equal(finding.location?.field, "minecraft:entity.description.runtime_identifier");
        }
    });
}
