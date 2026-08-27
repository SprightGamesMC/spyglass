import type { StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokensCase } from "../Types/StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokensTypes.js";
import StructuresFolderNameNotUnique from "../../src/Checks/Addon/StructuresFolderNameNotUnique.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokens {
    static readonly ID = "ADDON/204";
    static readonly CASES: readonly StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokensCase[] = [
        {
            name: "spright_cave folder is in creatorshortname_projectshortname unique form",
            packType: "behavior",
            paths: ["structures/spright_cave/house.mcstructure"],
            expectedPaths: [],
        },
        {
            name: "spright structures folder has no underscore so it is not in unique form",
            packType: "behavior",
            paths: ["structures/spright/house.mcstructure"],
            expectedPaths: [AddonFixture.BP + "structures/spright"],
        },
        {
            name: "s_c structures folder has one character tokens where each token needs two characters",
            packType: "behavior",
            paths: ["structures/s_c/house.mcstructure"],
            expectedPaths: [AddonFixture.BP + "structures/s_c"],
        },
    ];

    static async run(entry: StructuresFolderNameNotUniqueReportsFolderWithoutTwoTokensCase): Promise<string[]> {
        const summary = await AddonFixture.run(new StructuresFolderNameNotUnique(), AddonFixture.packPathFiles(entry));

        return summary.paths;
    }
}
