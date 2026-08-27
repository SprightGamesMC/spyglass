import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import UnknownCommandReportsUnlistedCommand from "../Helpers/UnknownCommandReportsUnlistedCommand.js";

for (const entry of UnknownCommandReportsUnlistedCommand.CASES) {
    test(UnknownCommandReportsUnlistedCommand.ID + " " + entry.name, async () => {
        const findings = await UnknownCommandReportsUnlistedCommand.run(entry);

        assert.deepEqual(ModelFixture.messages(findings), [...entry.expectedMessages]);
        assert.deepEqual(UnknownCommandReportsUnlistedCommand.lines(findings), [...entry.expectedLines]);

        for (const finding of findings) {
            assert.equal(finding.id, UnknownCommandReportsUnlistedCommand.ID);
            assert.equal(finding.path, UnknownCommandReportsUnlistedCommand.pathFor(entry.source));
            assert.equal(finding.pack, "BP");
        }
    });
}
