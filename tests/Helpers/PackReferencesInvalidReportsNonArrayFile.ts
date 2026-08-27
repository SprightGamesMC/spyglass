import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PackReferencesInvalidCase } from "../Types/PackReferencesInvalidReportsNonArrayFileTypes.js";
import PackReferencesInvalid from "../../src/Checks/World/PackReferencesInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";
import PackReferenceFixture from "./World/PackReferenceFixture.js";

export default abstract class PackReferencesInvalidReportsNonArrayFile {
    static readonly ID = "WORLD/203";
    static readonly CASES: readonly PackReferencesInvalidCase[] = [
        {
            name: "array with one object entry is an array of objects",
            content: [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }],
            expectedFields: [],
        },
        { name: "pack references file that contains an object is not an array", content: { pack_id: "x" }, expectedFields: [""] },
        { name: "pack reference entry that contains a string is not an object", content: ["text"], expectedFields: ["[0]"] },
        { name: "pack references file that does not parse is skipped", content: "{", expectedFields: [] },
    ];

    static run(content: object | string): Promise<Finding[]> {
        return PackReferenceFixture.run(new PackReferencesInvalid(), content);
    }
}
