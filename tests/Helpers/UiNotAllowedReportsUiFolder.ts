import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { UiNotAllowedReportsUiFolderCase } from "../Types/UiNotAllowedReportsUiFolderTypes.js";
import UiNotAllowed from "../../src/Checks/Addon/UiNotAllowed.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class UiNotAllowedReportsUiFolder {
    static readonly ID = "ADDON/702";
    static readonly UI_FOLDER = AddonFixture.RP + "ui";
    static readonly CASES: readonly UiNotAllowedReportsUiFolderCase[] = [
        {
            name: "textures/spright_cave/a.png has no ui folder",
            packType: "resource",
            paths: ["textures/spright_cave/a.png"],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "ui/hud_screen.json puts a ui folder directly under the RP",
            packType: "resource",
            paths: ["ui/hud_screen.json"],
            expectedIds: ["ADDON/702"],
            expectedPaths: [UiNotAllowedReportsUiFolder.UI_FOLDER],
        },
        {
            name: "textures/ui/a.png is a ui folder below the RP root and is allowed",
            packType: "resource",
            paths: ["textures/ui/a.png"],
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static async run(entry: UiNotAllowedReportsUiFolderCase): Promise<FindingSummary> {
        return AddonFixture.run(new UiNotAllowed(), AddonFixture.packPathFiles(entry));
    }
}
