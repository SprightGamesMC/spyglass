import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DefinitionSchemaInvalidGroupsIssuesByKind from "../Helpers/DefinitionSchemaInvalidGroupsIssuesByKind.js";

for (const entry of DefinitionSchemaInvalidGroupsIssuesByKind.CASES) {
    test(DefinitionSchemaInvalidGroupsIssuesByKind.ID + " " + entry.name, async () => {
        const findings = await DefinitionSchemaInvalidGroupsIssuesByKind.run(entry);

        assert.deepEqual(ModelFixture.messages(findings), [...entry.expectedMessages].sort());

        for (const finding of findings) {
            assert.equal(finding.id, DefinitionSchemaInvalidGroupsIssuesByKind.ID);
            assert.equal(finding.path, entry.path);
        }
    });
}
