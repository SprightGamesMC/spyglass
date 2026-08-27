import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ApprovalSheetSizeInvalidReportsWrongDimensionsCase } from "../Types/ApprovalSheetSizeInvalidReportsWrongDimensionsTypes.js";
import ApprovalSheetSizeInvalid from "../../src/Checks/Art/ApprovalSheetSizeInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class ApprovalSheetSizeInvalidReportsWrongDimensions {
    static readonly ID = "ART/213";
    static readonly CASES: readonly ApprovalSheetSizeInvalidReportsWrongDimensionsCase[] = [
        {
            name: "5120 by 1600 approval sheet is the required size",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "2560 by 800 approval sheet is not 5120 by 1600",
            files: {
                ...MarketplaceFixture.personaSubmission(),
                [MarketplaceFixture.APPROVAL_SHEET]: ImageBytes.png({ width: 2560, height: 800 }),
            },
            contentType: "persona",
            expectedIds: ["ART/213"],
            expectedPaths: [MarketplaceFixture.APPROVAL_SHEET],
        },
    ];

    static async run(entry: ApprovalSheetSizeInvalidReportsWrongDimensionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new ApprovalSheetSizeInvalid(), entry);
    }
}
