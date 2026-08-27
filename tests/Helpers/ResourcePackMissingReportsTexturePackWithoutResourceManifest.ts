import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ResourcePackMissingCase } from "../Types/ResourcePackMissingReportsTexturePackWithoutResourceManifestTypes.js";
import ResourcePackMissing from "../../src/Checks/TexturePack/ResourcePackMissing.js";
import ModelFixture from "./Core/ModelFixture.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class ResourcePackMissingReportsTexturePackWithoutResourceManifest {
    static readonly ID = "TEXTUREPACK/101";
    static readonly CASES: readonly ResourcePackMissingCase[] = [
        {
            name: "resource pack manifest present satisfies the texture pack rule",
            files: TextureFixture.resourcePack({}),
            options: { contentType: "texture" },
            expectedIds: [],
        },
        {
            name: "behavior pack manifest alone has no resource pack manifest",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest() },
            options: { contentType: "texture" },
            expectedIds: [ResourcePackMissingReportsTexturePackWithoutResourceManifest.ID],
        },
    ];

    static run(entry: ResourcePackMissingCase): Promise<Finding[]> {
        return TextureFixture.run(new ResourcePackMissing(), entry);
    }
}
