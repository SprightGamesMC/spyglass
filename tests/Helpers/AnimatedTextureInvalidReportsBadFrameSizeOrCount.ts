import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AnimatedTextureInvalidReportsBadFrameSizeOrCountCase } from "../Types/AnimatedTextureInvalidReportsBadFrameSizeOrCountTypes.js";
import AnimatedTextureInvalid from "../../src/Checks/Persona/AnimatedTextureInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class AnimatedTextureInvalidReportsBadFrameSizeOrCount {
    static readonly ID = "PERSONA/211";
    static readonly CASES: readonly AnimatedTextureInvalidReportsBadFrameSizeOrCountCase[] = [
        {
            name: "128 by 128 frames with 4 frames is a valid flipbook",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "spright_hat_anim.png": ImageBytes.png({ width: 128, height: 512 }) },
                metaOverrides: { texture_sources: [{ texture: "spright_hat_anim.png", animated: true, frames: 4 }] },
            }),
            expectedIds: [],
        },
        {
            name: "3 frames is not a power of two",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "spright_hat_anim.png": ImageBytes.png({ width: 128, height: 384 }) },
                metaOverrides: { texture_sources: [{ texture: "spright_hat_anim.png", animated: true, frames: 4 }] },
            }),
            expectedIds: ["PERSONA/211"],
        },
        {
            name: "64 by 64 frames is not 32 by 32 or 128 by 128",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "spright_hat_anim.png": ImageBytes.png({ width: 64, height: 256 }) },
                metaOverrides: { texture_sources: [{ texture: "spright_hat_anim.png", animated: true, frames: 4 }] },
            }),
            expectedIds: ["PERSONA/211"],
        },
    ];

    static run(entry: AnimatedTextureInvalidReportsBadFrameSizeOrCountCase): Promise<Finding[]> {
        return PersonaFixture.run(new AnimatedTextureInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
