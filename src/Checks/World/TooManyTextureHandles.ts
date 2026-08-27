import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { Pack, World } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import TextureHandleLoader from "../../Loaders/TextureHandleLoader.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldLimits from "./WorldLimits.js";

export default class TooManyTextureHandles extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.TOO_MANY_TEXTURE_HANDLES,
        slug: "too-many-texture-handles",
        severity: "error",
        description: "More than " + WorldLimits.TEXTURE_HANDLE_LIMIT + " texture handles",
    };

    private static resourcePacksOf(context: CheckContext, world: World): Pack[] {
        const packs = new Set<Pack>(world.packs.filter((pack) => pack.type === PackItemLoader.RESOURCE_PACK_TYPE));

        if (context.model.worlds.length === 1) {
            for (const pack of context.model.packs) {
                if (pack.type === PackItemLoader.RESOURCE_PACK_TYPE) {
                    packs.add(pack);
                }
            }
        }

        return [...packs];
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const handles = new Set<string>();

            for (const pack of TooManyTextureHandles.resourcePacksOf(context, world)) {
                for (const handle of await TextureHandleLoader.forPack(context, pack)) {
                    handles.add(handle);
                }
            }

            if (handles.size <= WorldLimits.TEXTURE_HANDLE_LIMIT) {
                continue;
            }

            findings.push(
                this.finding(
                    "World references " + handles.size + " texture handles, limit is " + WorldLimits.TEXTURE_HANDLE_LIMIT,
                    world.root
                )
            );
        }

        return findings;
    }
}
