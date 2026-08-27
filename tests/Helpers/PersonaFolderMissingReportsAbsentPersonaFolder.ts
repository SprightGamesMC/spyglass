import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PersonaFolderMissingReportsAbsentPersonaFolderCase } from "../Types/PersonaFolderMissingReportsAbsentPersonaFolderTypes.js";
import PersonaFolderMissing from "../../src/Checks/Marketplace/PersonaFolderMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PersonaFolderMissingReportsAbsentPersonaFolder {
    static readonly ID = "MARKETPLACE/105";
    static readonly CASES: readonly PersonaFolderMissingReportsAbsentPersonaFolderCase[] = [
        {
            name: "Content/persona folder is present for persona content",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "emote content with Content/emote instead of Content/persona lacks the persona folder",
            files: MarketplaceFixture.renameFolder(MarketplaceFixture.emoteSubmission(), MarketplaceFixture.PERSONA_ROOT, "Content/emote"),
            contentType: "persona",
            expectedIds: ["MARKETPLACE/105"],
            expectedPaths: [""],
        },
    ];

    static async run(entry: PersonaFolderMissingReportsAbsentPersonaFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PersonaFolderMissing(), entry);
    }
}
