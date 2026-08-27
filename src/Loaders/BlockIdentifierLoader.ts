import type { CheckContext } from "../Types/CheckTypes.js";
import type { ItemKind, PackType } from "../Types/ModelTypes.js";
import BlockSchema from "../Data/Schemas/BlockSchema.js";
import JsonLoader from "./JsonLoader.js";
import PackItemLoader from "./PackItemLoader.js";

export default abstract class BlockIdentifierLoader {
    static readonly KINDS: readonly ItemKind[] = ["block_behavior"];
    static readonly PACK_TYPE: PackType = PackItemLoader.BEHAVIOR_PACK_TYPE;
    private static readonly CACHE_KEY = "block-identifiers";

    static load(context: CheckContext): Promise<ReadonlySet<string>> {
        return context.loaders.cached(BlockIdentifierLoader.CACHE_KEY, () => BlockIdentifierLoader.collect(context));
    }

    private static async collect(context: CheckContext): Promise<ReadonlySet<string>> {
        const identifiers = new Set<string>();

        for (const { item } of PackItemLoader.select(context.model, BlockIdentifierLoader.KINDS, BlockIdentifierLoader.PACK_TYPE)) {
            const value = await context.loaders.json.readValue(item.path);
            const identifier = JsonLoader.get(value, BlockSchema.ROOT_KEY, "description", "identifier");

            if (typeof identifier !== "string") {
                continue;
            }

            identifiers.add(identifier);
            identifiers.add(BlockIdentifierLoader.withoutNamespace(identifier));
        }

        return identifiers;
    }

    private static withoutNamespace(identifier: string): string {
        const colon = identifier.indexOf(":");

        return colon < 0 ? identifier : identifier.slice(colon + 1);
    }
}
