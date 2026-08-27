import type { CheckContext } from "../Types/CheckTypes.js";
import type { BlockCatalogEntry, BlockCatalogUsage } from "../Types/DefinitionTypes.js";
import type { JsonValue } from "../Types/LoaderTypes.js";
import type { ItemKind } from "../Types/ModelTypes.js";
import JsonKeys from "../Data/JsonKeys.js";
import Namespaces from "../Data/Namespaces.js";
import BlockIdentifierLoader from "./BlockIdentifierLoader.js";
import JsonLoader from "./JsonLoader.js";
import PackItemLoader from "./PackItemLoader.js";

export default abstract class BlockCatalogLoader {
    static readonly CATALOG_KINDS: readonly ItemKind[] = ["blocks_catalog"];
    private static readonly CATALOG_PATH = "blocks.json";
    private static readonly RESOURCE_KEYS: readonly string[] = ["textures", "sound", "carried_textures"];
    private static readonly CACHE_KEY = "block-catalog-usage";

    static load(context: CheckContext): Promise<BlockCatalogUsage> {
        return context.loaders.cached(BlockCatalogLoader.CACHE_KEY, () => BlockCatalogLoader.collect(context));
    }

    private static async collect(context: CheckContext): Promise<BlockCatalogUsage> {
        const defined = await BlockIdentifierLoader.load(context);
        const vanillaKeys = new Set(Object.keys(context.loaders.vanilla.propertyHashes(BlockCatalogLoader.CATALOG_PATH) ?? {}));
        const unused: BlockCatalogEntry[] = [];
        const vanillaOverrides: BlockCatalogEntry[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, BlockCatalogLoader.CATALOG_KINDS)) {
            const catalog = await context.loaders.json.readObject(item.path);

            if (catalog === undefined) {
                continue;
            }

            for (const [key, value] of Object.entries(catalog)) {
                if (key === JsonKeys.FORMAT_VERSION || !BlockCatalogLoader.isResource(value) || defined.has(key)) {
                    continue;
                }

                const entry = { path: item.path, pack: pack.root, key };

                if (BlockCatalogLoader.isVanillaKey(key, vanillaKeys)) {
                    vanillaOverrides.push(entry);
                    continue;
                }

                unused.push(entry);
            }
        }

        return { unused, vanillaOverrides };
    }

    private static isResource(value: JsonValue | undefined): boolean {
        return JsonLoader.isObject(value) && BlockCatalogLoader.RESOURCE_KEYS.some((resourceKey) => value[resourceKey] !== undefined);
    }

    private static isVanillaKey(key: string, vanillaKeys: ReadonlySet<string>): boolean {
        if (vanillaKeys.has(key)) {
            return true;
        }

        return key.startsWith(Namespaces.VANILLA) && vanillaKeys.has(key.slice(Namespaces.VANILLA.length));
    }
}
