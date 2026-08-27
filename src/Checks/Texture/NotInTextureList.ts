import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { TextureImage } from "../../Types/TextureTypes.js";
import TextureFormat from "../../Loaders/TextureFormat.js";
import TextureListLoader from "../../Loaders/TextureListLoader.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";

export default class NotInTextureList extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.NOT_IN_TEXTURE_LIST,
        slug: "not-in-texture-list",
        severity: "error",
        description: "Texture missing from texture_list.json",
    };

    private static listedFor(byScope: Map<string, Set<string>>, image: TextureImage): Set<string> {
        const base = byScope.get(TextureListLoader.BASE_SCOPE) ?? new Set<string>();

        if (image.subpackFolder === undefined) {
            return base;
        }

        return new Set([...base, ...(byScope.get(image.subpackFolder.toLowerCase()) ?? [])]);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            const byScope = await TextureListLoader.listedKeysByScope(context, memory.pack);

            for (const image of memory.images) {
                const listed = NotInTextureList.listedFor(byScope, image);

                if (listed.size === 0) {
                    continue;
                }

                if (!TextureFormat.isTexturePath(image.key) || TextureMemoryLoader.isCompanion(image, memory) || listed.has(image.key)) {
                    continue;
                }

                findings.push(
                    this.finding("Texture " + image.key + " is not listed in texture_list.json", image.item.path, memory.pack.root)
                );
            }
        }

        return findings;
    }
}
