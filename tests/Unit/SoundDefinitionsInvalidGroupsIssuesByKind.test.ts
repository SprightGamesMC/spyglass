import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import SoundDefinitionsInvalidGroupsIssuesByKind from "../Helpers/SoundDefinitionsInvalidGroupsIssuesByKind.js";

for (const entry of SoundDefinitionsInvalidGroupsIssuesByKind.CASES) {
    test(SoundDefinitionsInvalidGroupsIssuesByKind.ID + " " + entry.name, async () => {
        const findings = await SoundDefinitionsInvalidGroupsIssuesByKind.run(entry.content);

        assert.deepEqual(ModelFixture.fields(findings), [...entry.expectedFields]);

        for (const finding of findings) {
            assert.equal(finding.id, SoundDefinitionsInvalidGroupsIssuesByKind.ID);
            assert.equal(finding.path, SoundDefinitionsInvalidGroupsIssuesByKind.PATH);
            assert.equal(finding.pack, "RP");
        }
    });
}
