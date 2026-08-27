import type { CheckContext } from "../Types/CheckTypes.js";
import type { JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { ContentItem, Pack } from "../Types/ModelTypes.js";
import type { SkinEntry, SkinPackDefinition } from "../Types/SkinTypes.js";
import PathUtilities from "../Storage/PathUtilities.js";
import JsonLoader from "./JsonLoader.js";
import PackItemLoader from "./PackItemLoader.js";

export default abstract class SkinPackLoader {
    static readonly SKIN_KEY_PREFIX = "skin.";
    static readonly PACK_KEY_PREFIX = "skinpack.";
    static readonly PACK_ATTRIBUTION_SUFFIX = ".by";
    private static readonly CACHE_KEY = "skin-pack-definitions";

    static load(context: CheckContext): Promise<SkinPackDefinition[]> {
        return context.loaders.cached(SkinPackLoader.CACHE_KEY, () => SkinPackLoader.build(context));
    }

    static skinPacks(context: CheckContext): Pack[] {
        return context.model.packs.filter((pack) => pack.type === PackItemLoader.SKIN_PACK_TYPE);
    }

    static skinsJsonItem(pack: Pack): ContentItem | undefined {
        return pack.items.find((item) => item.kind === "skins");
    }

    static langItems(pack: Pack): ContentItem[] {
        return pack.items.filter((item) => item.kind === "lang");
    }

    static textureItems(pack: Pack): ContentItem[] {
        return pack.items.filter((item) => item.kind === "texture");
    }

    static findTexture(pack: Pack, name: string): ContentItem | undefined {
        const textures = SkinPackLoader.textureItems(pack);

        return (
            textures.find((item) => item.packPath === name) ??
            textures.find((item) => PathUtilities.fileName(item.packPath) === PathUtilities.fileName(name))
        );
    }

    static expectedLangKeys(definition: SkinPackDefinition): string[] {
        if (definition.serializeName === undefined) {
            return [];
        }

        const keys = [SkinPackLoader.PACK_KEY_PREFIX + definition.serializeName];

        for (const skin of definition.skins) {
            if (skin.localizationName === undefined) {
                continue;
            }

            keys.push(SkinPackLoader.SKIN_KEY_PREFIX + definition.serializeName + "." + skin.localizationName);
        }

        return keys;
    }

    private static async build(context: CheckContext): Promise<SkinPackDefinition[]> {
        const definitions: SkinPackDefinition[] = [];

        for (const pack of SkinPackLoader.skinPacks(context)) {
            const item = SkinPackLoader.skinsJsonItem(pack);

            if (item === undefined) {
                continue;
            }

            const value = await context.loaders.json.readObject(item.path);

            if (value === undefined) {
                continue;
            }

            definitions.push(SkinPackLoader.describe(pack, item.path, value));
        }

        return definitions;
    }

    private static describe(pack: Pack, path: string, value: JsonObject): SkinPackDefinition {
        const skins = JsonLoader.isArray(value.skins) ? value.skins : [];

        return {
            pack,
            path,
            serializeName: SkinPackLoader.stringOrUndefined(value.serialize_name),
            localizationName: SkinPackLoader.stringOrUndefined(value.localization_name),
            skins: skins.map((skin, index) => SkinPackLoader.describeSkin(skin, index)),
        };
    }

    private static describeSkin(value: JsonValue, index: number): SkinEntry {
        const field = "skins[" + index + "]";

        if (!JsonLoader.isObject(value)) {
            return { index, field };
        }

        return {
            index,
            field,
            localizationName: SkinPackLoader.stringOrUndefined(value.localization_name),
            geometry: SkinPackLoader.stringOrUndefined(value.geometry),
            texture: SkinPackLoader.stringOrUndefined(value.texture),
            type: SkinPackLoader.stringOrUndefined(value.type),
            cape: SkinPackLoader.stringOrUndefined(value.cape),
        };
    }

    private static stringOrUndefined(value: JsonValue | undefined): string | undefined {
        return typeof value === "string" ? value : undefined;
    }
}
