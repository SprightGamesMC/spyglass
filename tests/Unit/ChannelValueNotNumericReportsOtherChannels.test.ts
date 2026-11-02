import assert from "node:assert/strict";
import { test } from "node:test";
import ChannelValueNotNumericReportsOtherChannels from "../Helpers/ChannelValueNotNumericReportsOtherChannels.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of ChannelValueNotNumericReportsOtherChannels.CASES) {
    test(ChannelValueNotNumericReportsOtherChannels.ID + " " + entry.name, async () => {
        const findings = await ChannelValueNotNumericReportsOtherChannels.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}
