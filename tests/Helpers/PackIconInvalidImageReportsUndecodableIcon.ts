import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackIconInvalidImageReportsUndecodableIconCase } from "../Types/PackIconInvalidImageReportsUndecodableIconTypes.js";
import PackIconInvalidImage from "../../src/Checks/Manifest/PackIconInvalidImage.js";
import ImageBytes from "./Core/ImageBytes.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class PackIconInvalidImageReportsUndecodableIcon {
    static readonly ID = "MANIFEST/219";
    static readonly CASES: readonly PackIconInvalidImageReportsUndecodableIconCase[] = [
        {
            name: "64 by 64 png pack_icon.png decodes as an image",
            files: ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 64, height: 64 })),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "pack_icon.png that contains plain text cannot be decoded as an image",
            files: ManifestFixture.behaviorWithIcon("not an image"),
            expectedIds: ["MANIFEST/219"],
            expectedPaths: ["BP/pack_icon.png"],
        },
    ];

    static async run(entry: PackIconInvalidImageReportsUndecodableIconCase): Promise<FindingSummary> {
        return ManifestFixture.run(new PackIconInvalidImage(), entry);
    }
}
