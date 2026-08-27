import type { CheckContext } from "../Types/CheckTypes.js";
import type { Pack } from "../Types/ModelTypes.js";
import type { TextureCoverage } from "../Types/TextureTypes.js";
import VanillaTextureExemptions from "../Data/VanillaTextureExemptions.js";
import PackItemLoader from "./PackItemLoader.js";
import TextureMemoryLoader from "./TextureMemoryLoader.js";

export default abstract class TextureCoverageLoader {
    private static readonly CACHE_KEY = "texture-coverage";

    static load(context: CheckContext): Promise<TextureCoverage> {
        return context.loaders.cached(TextureCoverageLoader.CACHE_KEY, () =>
            Promise.resolve(TextureCoverageLoader.compute(context, context.model.packs))
        );
    }

    static forPack(context: CheckContext, pack: Pack): TextureCoverage {
        return TextureCoverageLoader.compute(context, [pack]);
    }

    private static compute(context: CheckContext, packs: readonly Pack[]): TextureCoverage {
        const vanilla = [...context.loaders.vanilla.texturePaths()]
            .filter((path) => VanillaTextureExemptions.countsForCoverage(path))
            .sort();
        const overridden = TextureCoverageLoader.overriddenKeys(packs);
        const missing = vanilla.filter((path) => !overridden.has(path));
        const percent = vanilla.length === 0 ? undefined : ((vanilla.length - missing.length) / vanilla.length) * 100;

        return { vanillaCount: vanilla.length, missing, percent };
    }

    private static overriddenKeys(packs: readonly Pack[]): Set<string> {
        const overridden = new Set<string>();

        for (const pack of packs) {
            if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
                continue;
            }

            for (const item of pack.items) {
                if (TextureMemoryLoader.isImageItem(item)) {
                    overridden.add(TextureMemoryLoader.contentKey(item.packPath));
                }
            }
        }

        return overridden;
    }
}
