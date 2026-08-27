import type { CreatorFolderTooManySubfoldersReportsSecondProjectFolderCase } from "../Types/CreatorFolderTooManySubfoldersReportsSecondProjectFolderTypes.js";
import CreatorFolderTooManySubfolders from "../../src/Checks/Addon/CreatorFolderTooManySubfolders.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class CreatorFolderTooManySubfoldersReportsSecondProjectFolder {
    static readonly ID = "ADDON/401";
    static readonly CASES: readonly CreatorFolderTooManySubfoldersReportsSecondProjectFolderCase[] = [
        {
            name: "creator folder spright with one project folder and a common folder has one project subfolder",
            packType: "resource",
            paths: ["sounds/spright/cave/a.ogg", "sounds/spright/common/c.ogg"],
            expectedPaths: [],
        },
        {
            name: "creator folder spright with cave and mine subfolders has more than one project subfolder",
            packType: "resource",
            paths: ["sounds/spright/cave/a.ogg", "sounds/spright/mine/b.ogg", "sounds/spright/common/c.ogg"],
            expectedPaths: [AddonFixture.RP + "sounds/spright"],
        },
        {
            name: "subpack holding a textures folder and a sounds folder is a pack of its own and not a creator folder",
            packType: "resource",
            paths: ["subpacks/tier2/textures/spright_cave/a.png", "subpacks/tier2/sounds/spright_cave/a.ogg"],
            expectedPaths: [],
        },
        {
            name: "creator folder inside a subpack with cave and mine subfolders has more than one project subfolder",
            packType: "resource",
            paths: ["subpacks/tier2/sounds/spright/cave/a.ogg", "subpacks/tier2/sounds/spright/mine/b.ogg"],
            expectedPaths: [AddonFixture.RP + "subpacks/tier2/sounds/spright"],
        },
    ];

    static async run(entry: CreatorFolderTooManySubfoldersReportsSecondProjectFolderCase): Promise<string[]> {
        const summary = await AddonFixture.run(new CreatorFolderTooManySubfolders(), AddonFixture.packPathFiles(entry));

        return summary.paths;
    }
}
