import type { CheckContext } from "../Types/CheckTypes.js";
import type { Pack } from "../Types/ModelTypes.js";
import PathUtilities from "../Storage/PathUtilities.js";
import JsonLoader from "./JsonLoader.js";
import SubpackFormat from "./SubpackFormat.js";

export default abstract class TextureListLoader {
    static readonly BASE_SCOPE = "";
    private static readonly CACHE_KEY_PREFIX = "texture-list:";
    private static readonly SCOPE_CACHE_KEY_PREFIX = "texture-list-scope:";

    static scopeOf(packPath: string): string {
        return SubpackFormat.folderName(packPath)?.toLowerCase() ?? TextureListLoader.BASE_SCOPE;
    }

    static listedKeysByList(context: CheckContext, pack: Pack): Promise<Map<string, Set<string>>> {
        return context.loaders.cached(TextureListLoader.CACHE_KEY_PREFIX + pack.root, () => TextureListLoader.collect(context, pack));
    }

    static listedKeysByScope(context: CheckContext, pack: Pack): Promise<Map<string, Set<string>>> {
        return context.loaders.cached(TextureListLoader.SCOPE_CACHE_KEY_PREFIX + pack.root, () =>
            TextureListLoader.collectByScope(context, pack)
        );
    }

    private static async collect(context: CheckContext, pack: Pack): Promise<Map<string, Set<string>>> {
        const byList = new Map<string, Set<string>>();

        for (const list of pack.items.filter((item) => item.kind === "texture_list")) {
            byList.set(list.path, await TextureListLoader.readList(context, list.path));
        }

        return byList;
    }

    private static async collectByScope(context: CheckContext, pack: Pack): Promise<Map<string, Set<string>>> {
        const byScope = new Map<string, Set<string>>();

        for (const list of pack.items.filter((item) => item.kind === "texture_list")) {
            const scope = TextureListLoader.scopeOf(list.packPath);
            const keys = byScope.get(scope) ?? new Set<string>();

            for (const key of await TextureListLoader.readList(context, list.path)) {
                keys.add(key);
            }

            byScope.set(scope, keys);
        }

        return byScope;
    }

    private static async readList(context: CheckContext, path: string): Promise<Set<string>> {
        const keys = new Set<string>();
        const value = await context.loaders.json.readValue(path);

        if (!JsonLoader.isArray(value)) {
            return keys;
        }

        for (const entry of value) {
            const key = typeof entry === "string" ? PathUtilities.normalizeReference(entry.trim()) : undefined;

            if (key !== undefined) {
                keys.add(key);
            }
        }

        return keys;
    }
}
