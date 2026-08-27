import type { StructuresTooManySubfoldersReportsSecondSubfolderCase } from "../Types/StructuresTooManySubfoldersReportsSecondSubfolderTypes.js";
import StructuresTooManySubfolders from "../../src/Checks/Addon/StructuresTooManySubfolders.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class StructuresTooManySubfoldersReportsSecondSubfolder {
    static readonly ID = "ADDON/402";
    static readonly CASES: readonly StructuresTooManySubfoldersReportsSecondSubfolderCase[] = [
        {
            name: "spright_cave with nested folders inside it is one direct subfolder",
            packType: "behavior",
            paths: ["structures/spright_cave/a.mcstructure", "structures/spright_cave/deeper/b.mcstructure"],
            expectedPaths: [],
        },
        {
            name: "spright_cave and spright_mine are two direct subfolders where structures allows one",
            packType: "behavior",
            paths: ["structures/spright_cave/a.mcstructure", "structures/spright_mine/b.mcstructure"],
            expectedPaths: [AddonFixture.BP + "structures"],
        },
    ];

    static async run(entry: StructuresTooManySubfoldersReportsSecondSubfolderCase): Promise<string[]> {
        const summary = await AddonFixture.run(new StructuresTooManySubfolders(), AddonFixture.packPathFiles(entry));

        return summary.paths;
    }
}
