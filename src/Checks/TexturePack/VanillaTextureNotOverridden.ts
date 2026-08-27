import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureCoverageLoader from "../../Loaders/TextureCoverageLoader.js";
import Check from "../Check.js";
import TexturePackChecks from "./TexturePackChecks.js";

export default class VanillaTextureNotOverridden extends Check {
    readonly definition: CheckDefinition = {
        group: TexturePackChecks.GROUP,
        number: TexturePackChecks.VANILLA_TEXTURE_NOT_OVERRIDDEN,
        slug: "vanilla-texture-not-overridden",
        severity: "warning",
        description: "A vanilla texture is not overridden",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const coverage = await TextureCoverageLoader.load(context);

        return coverage.missing.map((path) => this.finding("Vanilla texture " + path + " is not overridden"));
    }
}
