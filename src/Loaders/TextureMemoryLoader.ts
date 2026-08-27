import type { CheckContext } from "../Types/CheckTypes.js";
import type { ImageReadFailureStatus, JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { ContentItem, Pack } from "../Types/ModelTypes.js";
import type {
    AtlasKind,
    AtlasTotal,
    PackTextureMemory,
    TextureCatalog,
    TextureImage,
    TextureImageFailure,
    TextureSetKeys,
    TextureSetLayerReference,
    TextureSubpack,
    TierMemory,
} from "../Types/TextureTypes.js";
import TextureSuffixes from "../Data/TextureSuffixes.js";
import PathUtilities from "../Storage/PathUtilities.js";
import ImageMetadataReader from "./ImageMetadataReader.js";
import JsonLoader from "./JsonLoader.js";
import ManifestLoader from "./ManifestLoader.js";
import PackItemLoader from "./PackItemLoader.js";
import SubpackFormat from "./SubpackFormat.js";
import TextureFormat from "./TextureFormat.js";
import TextureHandleLoader from "./TextureHandleLoader.js";

export default abstract class TextureMemoryLoader {
    private static readonly CACHE_KEY = "texture-memory";
    private static readonly CACHE_KEY_PREFIX = "texture-catalogs:";
    private static readonly EXCLUDED_PACK_TYPES: readonly Pack["type"][] = [
        PackItemLoader.BEHAVIOR_PACK_TYPE,
        PackItemLoader.WORLD_TEMPLATE_PACK_TYPE,
    ];

    static load(context: CheckContext): Promise<PackTextureMemory[]> {
        return context.loaders.cached(TextureMemoryLoader.CACHE_KEY, () => TextureMemoryLoader.collect(context));
    }

    static catalogs(context: CheckContext, pack: Pack): Promise<TextureCatalog[]> {
        return context.loaders.cached(TextureMemoryLoader.CACHE_KEY_PREFIX + pack.root, () =>
            TextureMemoryLoader.readCatalogs(context, pack)
        );
    }

    static isImageItem(item: ContentItem): boolean {
        if (item.kind !== "texture") {
            return false;
        }

        return ImageMetadataReader.IMAGE_EXTENSIONS.includes(PathUtilities.extension(item.packPath));
    }

    static contentKey(packPath: string): string {
        return PathUtilities.withoutExtension(SubpackFormat.pathWithoutSubpack(packPath)).toLowerCase();
    }

    static isMer(image: TextureImage, memory: PackTextureMemory): boolean {
        return memory.merKeys.has(image.key) || TextureSuffixes.hasSuffix(image.key, TextureSuffixes.MER);
    }

    static isCompanion(image: TextureImage, memory: PackTextureMemory): boolean {
        return memory.companionKeys.has(image.key) || TextureSuffixes.hasSuffix(image.key, TextureSuffixes.COMPANION);
    }

    static tiers(memory: PackTextureMemory): TierMemory[] {
        const tiers: TierMemory[] = [];
        let runningMaximum = 0;

        for (let tier = 0; tier < TextureFormat.TIER_COUNT; tier += 1) {
            const targeted = memory.subpacks.some((subpack) => subpack.tier === tier);

            if (tier > 0 && !targeted) {
                tiers.push({ tier, targeted, computed: false, total: runningMaximum, blockAtlas: 0, itemAtlas: 0 });
                continue;
            }

            const loaded = TextureMemoryLoader.loadedImages(memory, tier);
            const blockAtlas = TextureMemoryLoader.roundToPowerOfTwo(TextureMemoryLoader.sum(loaded, "block"));
            const itemAtlas = TextureMemoryLoader.roundToPowerOfTwo(TextureMemoryLoader.sum(loaded, "item"));
            const measured = TextureMemoryLoader.sum(loaded, undefined) + blockAtlas + itemAtlas;
            const total = measured > 0 ? measured : runningMaximum;

            runningMaximum = Math.max(runningMaximum, total);
            tiers.push({ tier, targeted, computed: true, total, blockAtlas, itemAtlas });
        }

        return tiers;
    }

    static atlasTotals(tier: TierMemory): AtlasTotal[] {
        return [
            { atlas: "block", bytes: tier.blockAtlas },
            { atlas: "item", bytes: tier.itemAtlas },
        ];
    }

    private static roundToPowerOfTwo(bytes: number): number {
        if (bytes <= 0) {
            return 0;
        }

        return 2 ** Math.ceil(Math.log2(bytes));
    }

    private static loadedImages(memory: PackTextureMemory, tier: number): TextureImage[] {
        const byKey = new Map<string, TextureImage>();

        for (const image of memory.images) {
            if (image.subpackFolder === undefined) {
                byKey.set(image.key, image);
            }
        }

        for (const image of memory.images) {
            if (image.subpackFolder !== undefined && image.tier === tier) {
                byKey.set(image.key, image);
            }
        }

        return [...byKey.values()];
    }

    private static sum(images: readonly TextureImage[], atlas: AtlasKind | undefined): number {
        return images.filter((image) => image.atlas === atlas).reduce((total, image) => total + image.bytes, 0);
    }

    private static async collect(context: CheckContext): Promise<PackTextureMemory[]> {
        const result: PackTextureMemory[] = [];

        for (const pack of context.model.packs) {
            if (TextureMemoryLoader.EXCLUDED_PACK_TYPES.includes(pack.type)) {
                continue;
            }

            result.push(await TextureMemoryLoader.collectPack(context, pack));
        }

        return result;
    }

    private static async collectPack(context: CheckContext, pack: Pack): Promise<PackTextureMemory> {
        const manifest = await ManifestLoader.read(context.loaders, pack);
        const subpacks = TextureMemoryLoader.readSubpacks(manifest);
        const atlasKeys = await TextureMemoryLoader.readAtlasReferences(context, pack);
        const images: TextureImage[] = [];
        const failures: TextureImageFailure[] = [];

        for (const item of pack.items) {
            if (!TextureMemoryLoader.isImageItem(item)) {
                continue;
            }

            const read = await context.loaders.image.read(item.path);

            if (read.status !== "ok") {
                TextureMemoryLoader.recordFailure(item, read.status, failures);
                continue;
            }

            const key = TextureMemoryLoader.contentKey(item.packPath);
            const subpackFolder = SubpackFormat.folderName(item.packPath);
            const tier = subpacks.find((subpack) => subpack.folder.toLowerCase() === subpackFolder?.toLowerCase())?.tier;

            images.push({
                item,
                key,
                width: read.metadata.width,
                height: read.metadata.height,
                bytes: read.metadata.width * read.metadata.height * TextureFormat.BYTES_PER_TEXEL,
                atlas: TextureMemoryLoader.atlasKind(key, atlasKeys),
                subpackFolder,
                tier,
            });
        }

        const imageKeys = new Set(images.map((image) => image.key));
        const { companionKeys, merKeys, layers } = await TextureMemoryLoader.readTextureSets(context, pack, imageKeys);

        return { pack, images, failures, subpacks, companionKeys, merKeys, layers, capabilities: ManifestLoader.capabilities(manifest) };
    }

    private static recordFailure(item: ContentItem, status: ImageReadFailureStatus, failures: TextureImageFailure[]): void {
        failures.push({ item, status });
    }

    private static readSubpacks(manifest: JsonObject | undefined): TextureSubpack[] {
        const subpacks: TextureSubpack[] = [];

        for (const entry of ManifestLoader.subpacks(manifest)) {
            const folder = entry.folder_name;

            if (typeof folder !== "string") {
                continue;
            }

            subpacks.push({ folder, tier: TextureMemoryLoader.tierOf(entry) });
        }

        return subpacks;
    }

    private static tierOf(subpack: JsonObject): number | undefined {
        const performanceTier = subpack.memory_performance_tier;

        if (typeof performanceTier === "number" && performanceTier >= 0 && performanceTier < TextureFormat.TIER_COUNT) {
            return performanceTier;
        }

        const memoryTier = subpack.memory_tier;

        if (typeof memoryTier !== "number") {
            return undefined;
        }

        const index = TextureFormat.MEMORY_TIER_UPPER_BOUNDS.findIndex((bound) => memoryTier <= bound);

        return index < 0 ? TextureFormat.HIGHEST_TIER : index;
    }

    private static async readCatalogs(context: CheckContext, pack: Pack): Promise<TextureCatalog[]> {
        const catalogs: TextureCatalog[] = [];

        for (const item of pack.items) {
            const contentPath = SubpackFormat.pathWithoutSubpack(item.packPath).toLowerCase();
            const kind = TextureMemoryLoader.catalogKind(contentPath);

            if (kind === undefined) {
                continue;
            }

            const data = JsonLoader.get(await context.loaders.json.readValue(item.path), "texture_data");

            if (JsonLoader.isObject(data)) {
                catalogs.push({ item, kind, data });
            }
        }

        return catalogs;
    }

    private static async readAtlasReferences(context: CheckContext, pack: Pack): Promise<Map<string, AtlasKind>> {
        const keys = new Map<string, AtlasKind>();

        for (const catalog of await TextureMemoryLoader.catalogs(context, pack)) {
            for (const entry of Object.values(catalog.data)) {
                for (const reference of TextureMemoryLoader.textureReferences(JsonLoader.get(entry, "textures"))) {
                    const key = PathUtilities.normalizeReference(reference);

                    if (key !== undefined) {
                        keys.set(key, catalog.kind);
                    }
                }
            }
        }

        return keys;
    }

    private static catalogKind(contentPath: string): AtlasKind | undefined {
        if (contentPath === TextureFormat.TERRAIN_TEXTURE_PATH) {
            return "block";
        }

        return contentPath === TextureFormat.ITEM_TEXTURE_PATH ? "item" : undefined;
    }

    private static textureReferences(value: JsonValue | undefined): string[] {
        if (typeof value === "string") {
            return [value];
        }

        if (JsonLoader.isArray(value)) {
            return value.flatMap((entry) => TextureMemoryLoader.textureReferences(entry));
        }

        const path = JsonLoader.get(value, "path");

        return typeof path === "string" ? [path] : [];
    }

    private static atlasKind(key: string, atlasKeys: ReadonlyMap<string, AtlasKind>): AtlasKind | undefined {
        if (key.startsWith(TextureHandleLoader.BLOCK_ATLAS_PREFIX)) {
            return "block";
        }

        if (key.startsWith(TextureHandleLoader.ITEM_ATLAS_PREFIX)) {
            return "item";
        }

        return atlasKeys.get(key);
    }

    private static async readTextureSets(context: CheckContext, pack: Pack, imageKeys: ReadonlySet<string>): Promise<TextureSetKeys> {
        const companionKeys = new Set<string>();
        const merKeys = new Set<string>();
        const layers: TextureSetLayerReference[] = [];

        for (const item of pack.items) {
            if (item.kind !== "texture_set") {
                continue;
            }

            const set = JsonLoader.get(await context.loaders.json.readValue(item.path), TextureFormat.TEXTURE_SET_ROOT);

            if (!JsonLoader.isObject(set)) {
                continue;
            }

            for (const layer of TextureFormat.TEXTURE_SET_LAYERS) {
                const reference = set[layer];

                if (typeof reference !== "string" || TextureFormat.isColorLiteral(reference)) {
                    continue;
                }

                const key = TextureFormat.resolveTextureSetLayer(item.packPath, reference);

                layers.push({ path: item.path, layer, reference, resolved: key !== undefined && imageKeys.has(key) });

                if (key === undefined || !TextureFormat.COMPANION_LAYERS.includes(layer)) {
                    continue;
                }

                companionKeys.add(key);

                if (TextureFormat.MER_LAYERS.includes(layer)) {
                    merKeys.add(key);
                }
            }
        }

        return { companionKeys, merKeys, layers };
    }
}
