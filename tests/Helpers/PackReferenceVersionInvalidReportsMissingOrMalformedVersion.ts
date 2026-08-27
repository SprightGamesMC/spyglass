import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PackReferenceVersionInvalidCase } from "../Types/PackReferenceVersionInvalidReportsMissingOrMalformedVersionTypes.js";
import PackReferenceVersionInvalid from "../../src/Checks/World/PackReferenceVersionInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import PackReferenceFixture from "./World/PackReferenceFixture.js";

export default abstract class PackReferenceVersionInvalidReportsMissingOrMalformedVersion {
    static readonly ID = "WORLD/205";
    static readonly CASES: readonly PackReferenceVersionInvalidCase[] = [
        {
            name: "version with three numbers is a valid version",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }],
            expectedFields: [],
        },
        {
            name: "version string 1.0.0 is a valid version",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: "1.0.0" }],
            expectedFields: [],
        },
        {
            name: "pack reference without version lacks the required version",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID }],
            expectedFields: ["[0].version"],
        },
        {
            name: "version with two numbers has fewer than the three required",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: [1, 0] }],
            expectedFields: ["[0].version"],
        },
        {
            name: "version string latest is not a version",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: "latest" }],
            expectedFields: ["[0].version"],
        },
    ];

    static run(content: object | string): Promise<Finding[]> {
        return PackReferenceFixture.run(new PackReferenceVersionInvalid(), content);
    }
}
