import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { SkinPackDefinition, SkinTextureRole } from "../../Types/SkinTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class TextureInvalidSize extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.TEXTURE_INVALID_SIZE,
        slug: "texture-invalid-size",
        severity: "error",
        description: "Skin or cape texture has wrong dimensions",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            const skinTextures = new Set(definition.skins.map((skin) => skin.texture).filter((name) => name !== undefined));
            const capeTextures = new Set(definition.skins.map((skin) => skin.cape).filter((name) => name !== undefined));

            for (const name of skinTextures) {
                findings.push(...(await this.checkTexture(context, definition, name, "skin")));
            }

            for (const name of capeTextures) {
                findings.push(...(await this.checkTexture(context, definition, name, "cape")));
            }
        }

        return findings;
    }

    private async checkTexture(
        context: CheckContext,
        definition: SkinPackDefinition,
        name: string,
        role: SkinTextureRole
    ): Promise<Finding[]> {
        const item = SkinPackLoader.findTexture(definition.pack, name);

        if (item === undefined) {
            return [];
        }

        const image = await context.loaders.image.read(item.path);

        if (image.status !== "ok") {
            return [];
        }

        const allowed = role === "skin" ? SkinLimits.SKIN_TEXTURE_SIZES : SkinLimits.CAPE_TEXTURE_SIZES;
        const { width, height } = image.metadata;

        if (allowed.some(([allowedWidth, allowedHeight]) => allowedWidth === width && allowedHeight === height)) {
            return [];
        }

        const expected = allowed.map(([allowedWidth, allowedHeight]) => allowedWidth + "x" + allowedHeight).join(" or ");

        return [
            this.finding(
                (role === "skin" ? "Skin" : "Cape") + " texture is " + width + "x" + height + ", expected " + expected,
                item.path,
                definition.pack.root
            ),
        ];
    }
}
