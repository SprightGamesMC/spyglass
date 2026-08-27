import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PersonaArtFormatInvalidReportsWrongFormatCase } from "../Types/PersonaArtFormatInvalidReportsWrongFormatTypes.js";
import PersonaArtFormatInvalid from "../../src/Checks/Art/PersonaArtFormatInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PersonaArtFormatInvalidReportsWrongFormat {
    static readonly ID = "ART/212";
    static readonly WALKING_GIF = MarketplaceFixture.marketingPath(MarketplaceFixture.PIECE_ID + "_Walking.gif");
    static readonly CASES: readonly PersonaArtFormatInvalidReportsWrongFormatCase[] = [
        {
            name: "PNG thumbnail and approval sheet with GIF previews are the required persona art formats",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "JPEG approval sheet is not PNG and PNG bytes in the walk cycle GIF are not GIF",
            files: {
                ...MarketplaceFixture.personaSubmission(),
                [MarketplaceFixture.APPROVAL_SHEET]: ImageBytes.jpeg({ width: 5120, height: 1600 }),
                [PersonaArtFormatInvalidReportsWrongFormat.WALKING_GIF]: ImageBytes.png({ width: 64, height: 64 }),
            },
            contentType: "persona",
            expectedIds: ["ART/212", "ART/212"],
            expectedPaths: [MarketplaceFixture.APPROVAL_SHEET, PersonaArtFormatInvalidReportsWrongFormat.WALKING_GIF],
        },
        {
            name: "PNG bytes in the emote preview GIF are not GIF",
            files: {
                ...MarketplaceFixture.emoteSubmission(),
                [MarketplaceFixture.EMOTE_GIF]: ImageBytes.png({ width: 64, height: 64 }),
            },
            contentType: "persona",
            expectedIds: ["ART/212"],
            expectedPaths: [MarketplaceFixture.EMOTE_GIF],
        },
    ];

    static async run(entry: PersonaArtFormatInvalidReportsWrongFormatCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PersonaArtFormatInvalid(), entry);
    }
}
