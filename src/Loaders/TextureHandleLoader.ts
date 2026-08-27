import type { CheckContext } from "../Types/CheckTypes.js";
import type { ItemKind, Pack } from "../Types/ModelTypes.js";
import type { TextureHandleSet } from "../Types/TextureTypes.js";
import PathUtilities from "../Storage/PathUtilities.js";
import JsonLoader from "./JsonLoader.js";
import PackItemLoader from "./PackItemLoader.js";
import TextureFormat from "./TextureFormat.js";

export default abstract class TextureHandleLoader {
    static readonly BLOCK_ATLAS_PREFIX = "textures/blocks/";
    static readonly ITEM_ATLAS_PREFIX = "textures/items/";
    private static readonly HANDLE_KINDS: readonly ItemKind[] = ["entity_resource", "attachable", "particle", "ui", "flipbook_textures"];
    private static readonly ATLAS_PREFIXES: readonly string[] = [
        TextureHandleLoader.BLOCK_ATLAS_PREFIX,
        TextureHandleLoader.ITEM_ATLAS_PREFIX,
    ];
    private static readonly CACHE_KEY = "texture-handles";

    static async forPack(context: CheckContext, pack: Pack): Promise<ReadonlySet<string>> {
        const sets = await TextureHandleLoader.load(context);

        return sets.find((set) => set.packRoot === pack.root)?.handles ?? new Set();
    }

    private static load(context: CheckContext): Promise<TextureHandleSet[]> {
        return context.loaders.cached(TextureHandleLoader.CACHE_KEY, () => TextureHandleLoader.collect(context));
    }

    private static async collect(context: CheckContext): Promise<TextureHandleSet[]> {
        const sets: TextureHandleSet[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
                continue;
            }

            sets.push({ packRoot: pack.root, handles: await TextureHandleLoader.collectPack(context, pack) });
        }

        return sets;
    }

    private static async collectPack(context: CheckContext, pack: Pack): Promise<Set<string>> {
        const handles = new Set<string>();

        for (const item of pack.items) {
            if (!TextureHandleLoader.HANDLE_KINDS.includes(item.kind)) {
                continue;
            }

            const value = await context.loaders.json.readValue(item.path);
            const references = JsonLoader.collectStrings(value, TextureFormat.isTexturePath);

            for (const reference of references) {
                const normalized = PathUtilities.normalizeReference(reference.value);

                if (
                    normalized === undefined ||
                    TextureHandleLoader.isAtlas(normalized) ||
                    context.loaders.vanilla.hasTexturePath(normalized)
                ) {
                    continue;
                }

                handles.add(normalized);
            }
        }

        return handles;
    }

    private static isAtlas(path: string): boolean {
        return TextureHandleLoader.ATLAS_PREFIXES.some((prefix) => path.startsWith(prefix));
    }
}
