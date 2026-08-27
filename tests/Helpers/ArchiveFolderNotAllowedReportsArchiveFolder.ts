import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ArchiveFolderNotAllowedReportsArchiveFolderCase } from "../Types/ArchiveFolderNotAllowedReportsArchiveFolderTypes.js";
import ArchiveFolderNotAllowed from "../../src/Checks/Marketplace/ArchiveFolderNotAllowed.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class ArchiveFolderNotAllowedReportsArchiveFolder {
    static readonly ID = "MARKETPLACE/701";
    static readonly PACK_ARCHIVE = MarketplaceFixture.BEHAVIOR_ROOT + "/__brarchive";
    static readonly SUBPACK_ARCHIVE = MarketplaceFixture.RESOURCE_ROOT + "/subpacks/high/__BrArchive";
    static readonly CASES: readonly ArchiveFolderNotAllowedReportsArchiveFolderCase[] = [
        {
            name: "submission without an archive folder has no archive folder",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "__brarchive inside a behavior pack is an archive folder in the submission",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [ArchiveFolderNotAllowedReportsArchiveFolder.PACK_ARCHIVE + "/entities/old.json"]: "{}",
            },
            expectedIds: ["MARKETPLACE/701"],
            expectedPaths: [ArchiveFolderNotAllowedReportsArchiveFolder.PACK_ARCHIVE],
        },
        {
            name: "__BrArchive inside a subpack is matched ignoring case and reported once for its two files",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [ArchiveFolderNotAllowedReportsArchiveFolder.SUBPACK_ARCHIVE + "/textures/a.png"]: "x",
                [ArchiveFolderNotAllowedReportsArchiveFolder.SUBPACK_ARCHIVE + "/textures/b.png"]: "x",
            },
            expectedIds: ["MARKETPLACE/701"],
            expectedPaths: [ArchiveFolderNotAllowedReportsArchiveFolder.SUBPACK_ARCHIVE],
        },
    ];

    static async run(entry: ArchiveFolderNotAllowedReportsArchiveFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new ArchiveFolderNotAllowed(), entry);
    }
}
