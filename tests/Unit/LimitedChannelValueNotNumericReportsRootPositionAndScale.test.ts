import assert from "node:assert/strict";
import { test } from "node:test";
import LimitedChannelValueNotNumericReportsRootPositionAndScale from "../Helpers/LimitedChannelValueNotNumericReportsRootPositionAndScale.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of LimitedChannelValueNotNumericReportsRootPositionAndScale.CASES) {
    test(LimitedChannelValueNotNumericReportsRootPositionAndScale.ID + " " + entry.name, async () => {
        const findings = await LimitedChannelValueNotNumericReportsRootPositionAndScale.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}
