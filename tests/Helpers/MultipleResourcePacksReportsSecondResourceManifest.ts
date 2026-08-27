import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MultipleResourcePacksReportsSecondResourceManifestCase } from "../Types/MultipleResourcePacksReportsSecondResourceManifestTypes.js";
import MultipleResourcePacks from "../../src/Checks/TexturePack/MultipleResourcePacks.js";
import ModelFixture from "./Core/ModelFixture.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class MultipleResourcePacksReportsSecondResourceManifest {
    static readonly ID = "TEXTUREPACK/601";
    static readonly CASES: readonly MultipleResourcePacksReportsSecondResourceManifestCase[] = [
        {
            name: "single RP manifest is the allowed one resource pack",
            files: TextureFixture.resourcePack({}),
            options: { contentType: "texture" },
            expectedIds: [],
        },
        {
            name: "RP2/manifest.json is a second resource pack manifest",
            files: {
                ...TextureFixture.resourcePack({}),
                "RP2/manifest.json": ModelFixture.resourceManifest({
                    header: {
                        name: "Second",
                        uuid: "1a2b3c4d-0000-4000-8000-000000000001",
                        version: [1, 0, 0],
                        min_engine_version: [1, 21, 0],
                    },
                }),
            },
            options: { contentType: "texture" },
            expectedIds: [MultipleResourcePacksReportsSecondResourceManifest.ID],
            expectedPaths: ["RP2/manifest.json"],
        },
    ];

    static run(entry: MultipleResourcePacksReportsSecondResourceManifestCase): Promise<FindingSummary> {
        return TextureFixture.summary(new MultipleResourcePacks(), entry);
    }
}
