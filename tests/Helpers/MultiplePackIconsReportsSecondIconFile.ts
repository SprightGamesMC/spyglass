import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MultiplePackIconsReportsSecondIconFileCase } from "../Types/MultiplePackIconsReportsSecondIconFileTypes.js";
import MultiplePackIcons from "../../src/Checks/Manifest/MultiplePackIcons.js";
import ImageBytes from "./Core/ImageBytes.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class MultiplePackIconsReportsSecondIconFile {
    static readonly ID = "MANIFEST/607";
    static readonly CASES: readonly MultiplePackIconsReportsSecondIconFileCase[] = [
        {
            name: "behavior pack with a single pack_icon.png is within the one icon limit",
            files: ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 64, height: 64 })),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "pack_icon.png and pack_icon_old.png are more than one pack icon file",
            files: {
                ...ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 64, height: 64 })),
                "BP/pack_icon_old.png": ImageBytes.png({ width: 64, height: 64 }),
            },
            expectedIds: ["MANIFEST/607"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: MultiplePackIconsReportsSecondIconFileCase): Promise<FindingSummary> {
        return ManifestFixture.run(new MultiplePackIcons(), entry);
    }
}
