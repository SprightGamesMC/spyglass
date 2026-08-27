import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MaterialIdentifierInvalidReportsGenericFirstSegmentCase } from "../Types/MaterialIdentifierInvalidReportsGenericFirstSegmentTypes.js";
import MaterialIdentifierInvalid from "../../src/Checks/Addon/MaterialIdentifierInvalid.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MaterialIdentifierInvalidReportsGenericFirstSegment {
    static readonly ID = "ADDON/208";
    static readonly PATH = AddonFixture.RP + "materials/cave.material";
    static readonly CASES: readonly MaterialIdentifierInvalidReportsGenericFirstSegmentCase[] = [
        {
            name: "spright_cave_glow:entity has a creator project and material token before the base",
            key: "spright_cave_glow:entity",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "version key is the material file version and not a material name",
            key: "version",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "spright_cave:entity first segment has only two tokens and lacks a material name",
            key: "spright_cave:entity",
            expectedIds: ["ADDON/208"],
            expectedPaths: [MaterialIdentifierInvalidReportsGenericFirstSegment.PATH],
        },
        {
            name: "mobs_cave_glow:entity starts with the generic word mobs instead of a creator name",
            key: "mobs_cave_glow:entity",
            expectedIds: ["ADDON/208"],
            expectedPaths: [MaterialIdentifierInvalidReportsGenericFirstSegment.PATH],
        },
        {
            name: "glow:entity first segment has no creator or project token",
            key: "glow:entity",
            expectedIds: ["ADDON/208"],
            expectedPaths: [MaterialIdentifierInvalidReportsGenericFirstSegment.PATH],
        },
    ];

    static async run(entry: MaterialIdentifierInvalidReportsGenericFirstSegmentCase): Promise<FindingSummary> {
        const files = {
            [AddonFixture.RP + "manifest.json"]: ModelFixture.resourceManifest(),
            [MaterialIdentifierInvalidReportsGenericFirstSegment.PATH]: JSON.stringify({ materials: { [entry.key]: {} } }),
        };

        return AddonFixture.run(new MaterialIdentifierInvalid(), files);
    }
}
