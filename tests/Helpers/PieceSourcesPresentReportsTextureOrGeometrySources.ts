import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PieceSourcesPresentReportsTextureOrGeometrySourcesCase } from "../Types/PieceSourcesPresentReportsTextureOrGeometrySourcesTypes.js";
import PieceSourcesPresent from "../../src/Checks/Emote/PieceSourcesPresent.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class PieceSourcesPresentReportsTextureOrGeometrySources {
    static readonly ID = "EMOTE/209";
    static readonly CASES: readonly PieceSourcesPresentReportsTextureOrGeometrySourcesCase[] = [
        {
            name: "emote meta without texture_sources or geometry_sources has no piece sources",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "texture_sources in emote meta is a piece source emotes cannot have",
            files: PersonaFixture.emoteFiles({ metaOverrides: { texture_sources: [] } }),
            expectedIds: ["EMOTE/209"],
        },
        {
            name: "texture_sources and geometry_sources in emote meta are two piece sources emotes cannot have",
            files: PersonaFixture.emoteFiles({ metaOverrides: { texture_sources: [], geometry_sources: [] } }),
            expectedIds: PersonaFixture.repeat("EMOTE/209", 2),
        },
    ];

    static run(entry: PieceSourcesPresentReportsTextureOrGeometrySourcesCase): Promise<Finding[]> {
        return PersonaFixture.run(new PieceSourcesPresent(), entry.files, entry.contentType ?? "persona");
    }
}
