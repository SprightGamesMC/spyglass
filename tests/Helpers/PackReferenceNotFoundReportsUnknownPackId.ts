import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PackReferenceNotFoundCase } from "../Types/PackReferenceNotFoundReportsUnknownPackIdTypes.js";
import PackReferenceNotFound from "../../src/Checks/World/PackReferenceNotFound.js";
import ModelFixture from "./Core/ModelFixture.js";
import PackReferenceFixture from "./World/PackReferenceFixture.js";

export default abstract class PackReferenceNotFoundReportsUnknownPackId {
    static readonly ID = "WORLD/301";
    static readonly CASES: readonly PackReferenceNotFoundCase[] = [
        {
            name: "pack_id matching the nested behavior pack uuid resolves to a pack",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }],
            expectedFields: [],
        },
        {
            name: "upper case pack_id matches the nested behavior pack uuid ignoring case",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID.toUpperCase(), version: "1.0.0" }],
            expectedFields: [],
        },
        {
            name: "pack_id nope is not a uuid so it is not looked up",
            content: [{ pack_id: "nope", version: [1, 0, 0] }],
            expectedFields: [],
        },
        {
            name: "pack_id matching no pack in the world cannot be resolved",
            content: [{ pack_id: "8b4c7e4a-3f4d-4e5c-9a0b-2c3d4e5f6a7b", version: [1, 0, 0] }],
            expectedFields: ["[0].pack_id"],
        },
    ];

    static run(content: object | string): Promise<Finding[]> {
        return PackReferenceFixture.run(new PackReferenceNotFound(), content);
    }
}
