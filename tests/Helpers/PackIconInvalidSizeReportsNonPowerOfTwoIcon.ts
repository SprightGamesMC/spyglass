import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackIconInvalidSizeReportsNonPowerOfTwoIconCase } from "../Types/PackIconInvalidSizeReportsNonPowerOfTwoIconTypes.js";
import PackIconInvalidSize from "../../src/Checks/Manifest/PackIconInvalidSize.js";
import ImageBytes from "./Core/ImageBytes.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class PackIconInvalidSizeReportsNonPowerOfTwoIcon {
    static readonly ID = "MANIFEST/220";
    static readonly CASES: readonly PackIconInvalidSizeReportsNonPowerOfTwoIconCase[] = [
        {
            name: "256 by 256 pack_icon.png is a square power of two within 2 to 256",
            files: ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 256, height: 256 })),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "60 by 60 pack_icon.png is not a power of two",
            files: ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 60, height: 60 })),
            expectedIds: ["MANIFEST/220"],
            expectedPaths: ["BP/pack_icon.png"],
        },
        {
            name: "64 by 32 pack_icon.png is not square",
            files: ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 64, height: 32 })),
            expectedIds: ["MANIFEST/220"],
            expectedPaths: ["BP/pack_icon.png"],
        },
        {
            name: "512 by 512 pack_icon.png is above the 256 side limit",
            files: ManifestFixture.behaviorWithIcon(ImageBytes.png({ width: 512, height: 512 })),
            expectedIds: ["MANIFEST/220"],
            expectedPaths: ["BP/pack_icon.png"],
        },
    ];

    static async run(entry: PackIconInvalidSizeReportsNonPowerOfTwoIconCase): Promise<FindingSummary> {
        return ManifestFixture.run(new PackIconInvalidSize(), entry);
    }
}
