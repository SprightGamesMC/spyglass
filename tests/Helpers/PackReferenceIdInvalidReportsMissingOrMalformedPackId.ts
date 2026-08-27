import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PackReferenceIdInvalidCase } from "../Types/PackReferenceIdInvalidReportsMissingOrMalformedPackIdTypes.js";
import PackReferenceIdInvalid from "../../src/Checks/World/PackReferenceIdInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import PackReferenceFixture from "./World/PackReferenceFixture.js";

export default abstract class PackReferenceIdInvalidReportsMissingOrMalformedPackId {
    static readonly ID = "WORLD/204";
    static readonly CASES: readonly PackReferenceIdInvalidCase[] = [
        {
            name: "pack_id that is a uuid is valid",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }],
            expectedFields: [],
        },
        {
            name: "pack reference without pack_id lacks the required uuid",
            content: [{ version: [1, 0, 0] }],
            expectedFields: ["[0].pack_id"],
        },
        { name: "pack_id nope is not a valid uuid", content: [{ pack_id: "nope", version: [1, 0, 0] }], expectedFields: ["[0].pack_id"] },
        { name: "pack reference entry that is a string is not checked for pack_id", content: ["text"], expectedFields: [] },
    ];

    static run(content: object | string): Promise<Finding[]> {
        return PackReferenceFixture.run(new PackReferenceIdInvalid(), content);
    }
}
