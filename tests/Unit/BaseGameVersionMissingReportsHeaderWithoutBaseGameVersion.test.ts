import assert from "node:assert/strict";
import { test } from "node:test";
import BaseGameVersionMissingReportsHeaderWithoutBaseGameVersion from "../Helpers/BaseGameVersionMissingReportsHeaderWithoutBaseGameVersion.js";
import WorldTemplateFixture from "../Helpers/World/WorldTemplateFixture.js";

for (const entry of BaseGameVersionMissingReportsHeaderWithoutBaseGameVersion.CASES) {
    test(BaseGameVersionMissingReportsHeaderWithoutBaseGameVersion.ID + " " + entry.name, async () => {
        const findings = await BaseGameVersionMissingReportsHeaderWithoutBaseGameVersion.run(entry);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        for (const finding of findings) {
            assert.equal(finding.id, BaseGameVersionMissingReportsHeaderWithoutBaseGameVersion.ID);
            assert.equal(finding.path, WorldTemplateFixture.MANIFEST_PATH);
            assert.equal(finding.pack, "World");
            assert.equal(finding.location?.field, "header.base_game_version");
        }
    });
}
