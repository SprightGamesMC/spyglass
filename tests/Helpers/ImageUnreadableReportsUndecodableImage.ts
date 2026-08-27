import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ImageUnreadableReportsUndecodableImageCase } from "../Types/ImageUnreadableReportsUndecodableImageTypes.js";
import ImageUnreadable from "../../src/Checks/Texture/ImageUnreadable.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class ImageUnreadableReportsUndecodableImage {
    static readonly ID = "TEXTURE/201";
    static readonly CASES: readonly ImageUnreadableReportsUndecodableImageCase[] = [
        {
            name: "16 by 16 png decodes so its metadata can be read",
            files: TextureFixture.resourcePack({ "textures/entity/good.png": TextureFixture.png(16, 16) }),
            expectedIds: [],
        },
        {
            name: "png that contains plain text cannot be decoded",
            files: TextureFixture.resourcePack({ "textures/entity/bad.png": "not an image" }),
            expectedIds: [ImageUnreadableReportsUndecodableImage.ID],
            expectedPaths: ["RP/textures/entity/bad.png"],
        },
        {
            name: "tga that contains plain text cannot be decoded",
            files: TextureFixture.resourcePack({ "textures/entity/bad.tga": "not an image" }),
            expectedIds: [ImageUnreadableReportsUndecodableImage.ID],
            expectedPaths: ["RP/textures/entity/bad.tga"],
        },
    ];

    static run(entry: ImageUnreadableReportsUndecodableImageCase): Promise<FindingSummary> {
        return TextureFixture.summary(new ImageUnreadable(), entry);
    }
}
