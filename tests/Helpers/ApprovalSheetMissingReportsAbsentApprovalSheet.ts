import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ApprovalSheetMissingReportsAbsentApprovalSheetCase } from "../Types/ApprovalSheetMissingReportsAbsentApprovalSheetTypes.js";
import ApprovalSheetMissing from "../../src/Checks/Art/ApprovalSheetMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class ApprovalSheetMissingReportsAbsentApprovalSheet {
    static readonly ID = "ART/108";
    static readonly CASES: readonly ApprovalSheetMissingReportsAbsentApprovalSheetCase[] = [
        {
            name: "persona ApprovalSheet.png in Marketing Art satisfies the approval sheet requirement",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona Marketing Art without an ApprovalSheet.png lacks the required approval sheet",
            files: MarketplaceFixture.without(MarketplaceFixture.personaSubmission(), MarketplaceFixture.APPROVAL_SHEET),
            contentType: "persona",
            expectedIds: ["ART/108"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
    ];

    static async run(entry: ApprovalSheetMissingReportsAbsentApprovalSheetCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new ApprovalSheetMissing(), entry);
    }
}
