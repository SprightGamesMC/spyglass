import type { Finding } from "../../src/Types/CheckTypes.js";
import type { TextureFramesOverLimitReportsTooManyFramesCase } from "../Types/TextureFramesOverLimitReportsTooManyFramesTypes.js";
import TextureFramesOverLimit from "../../src/Checks/Persona/TextureFramesOverLimit.js";
import ImageBytes from "./Core/ImageBytes.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TextureFramesOverLimitReportsTooManyFrames {
    static readonly ID = "PERSONA/401";
    static readonly CASES: readonly TextureFramesOverLimitReportsTooManyFramesCase[] = [
        {
            name: "32 frames at 32 px is at the limit for 32 px frames",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "spright_hat_anim.png": ImageBytes.png({ width: 32, height: 1024 }) },
                metaOverrides: { texture_sources: [{ texture: "spright_hat_anim.png", animated: true, frames: 4 }] },
            }),
            expectedIds: [],
        },
        {
            name: "64 frames at 32 px is above the 32 frame limit for 32 px frames",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "spright_hat_anim.png": ImageBytes.png({ width: 32, height: 2048 }) },
                metaOverrides: { texture_sources: [{ texture: "spright_hat_anim.png", animated: true, frames: 4 }] },
            }),
            expectedIds: ["PERSONA/401"],
        },
        {
            name: "32 frames at 128 px is above the 16 frame limit for 128 px frames",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "spright_hat_anim.png": ImageBytes.png({ width: 128, height: 4096 }) },
                metaOverrides: { texture_sources: [{ texture: "spright_hat_anim.png", animated: true, frames: 4 }] },
            }),
            expectedIds: ["PERSONA/401"],
        },
    ];

    static run(entry: TextureFramesOverLimitReportsTooManyFramesCase): Promise<Finding[]> {
        return PersonaFixture.run(new TextureFramesOverLimit(), entry.files, entry.contentType ?? "persona");
    }
}
