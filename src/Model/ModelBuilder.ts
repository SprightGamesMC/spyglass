import type { Layout } from "../Types/CheckTypes.js";
import type { JsonValue } from "../Types/LoaderTypes.js";
import type { ArtFile, ArtFolder, ContentItem, ContentModel, Pack, PackType, World } from "../Types/ModelTypes.js";
import type { FileEntry, Storage } from "../Types/StorageTypes.js";
import JsonLoader from "../Loaders/JsonLoader.js";
import PackItemLoader from "../Loaders/PackItemLoader.js";
import PersonaFormat from "../Loaders/PersonaFormat.js";
import TextureFormat from "../Loaders/TextureFormat.js";
import PathUtilities from "../Storage/PathUtilities.js";
import ItemClassifier from "./ItemClassifier.js";

export default class ModelBuilder {
    static readonly MANIFEST_NAME = "manifest.json";
    static readonly PACK_CONTAINER_FOLDERS: readonly string[] = ["behavior_packs", "resource_packs", "skin_packs", "skin_pack"];
    private static readonly LEVEL_DAT_NAME = "level.dat";
    private static readonly ART_FOLDERS: readonly ArtFolder[] = ["Marketing Art", "Store Art"];
    private static readonly MODULE_TYPES: Readonly<Record<string, PackType>> = {
        data: PackItemLoader.BEHAVIOR_PACK_TYPE,
        script: PackItemLoader.BEHAVIOR_PACK_TYPE,
        javascript: PackItemLoader.BEHAVIOR_PACK_TYPE,
        resources: PackItemLoader.RESOURCE_PACK_TYPE,
        skin_pack: PackItemLoader.SKIN_PACK_TYPE,
        world_template: PackItemLoader.WORLD_TEMPLATE_PACK_TYPE,
        persona_piece: PackItemLoader.PERSONA_PACK_TYPE,
    };

    private readonly storage: Storage;
    private readonly layout: Layout;
    private readonly json: JsonLoader;

    private static discoverArt(files: readonly FileEntry[]): ArtFile[] {
        const art: ArtFile[] = [];

        for (const file of files) {
            const folder = ModelBuilder.artFolderOf(file.path);

            if (folder === undefined) {
                continue;
            }

            art.push({ folder, path: file.path, name: PathUtilities.fileName(file.path), size: file.size });
        }

        return art;
    }

    private static artFolderOf(path: string): ArtFolder | undefined {
        const first = PathUtilities.firstSegment(path).toLowerCase();

        return ModelBuilder.ART_FOLDERS.find((folder) => folder.toLowerCase() === first);
    }

    private static isArtPath(path: string): boolean {
        return ModelBuilder.artFolderOf(path) !== undefined;
    }

    private static findManifests(files: readonly FileEntry[]): string[] {
        return files
            .filter((file) => PathUtilities.fileName(file.path).toLowerCase() === ModelBuilder.MANIFEST_NAME)
            .map((file) => file.path);
    }

    private static isPackContainerChild(root: string, worldRoot: string, worldRoots: ReadonlySet<string>): boolean {
        if (!worldRoots.has(worldRoot)) {
            return false;
        }

        const relative = PathUtilities.relativeTo(root, worldRoot);
        const segments = PathUtilities.segments(relative);

        return segments.length === 2 && ModelBuilder.PACK_CONTAINER_FOLDERS.includes(segments[0].toLowerCase());
    }

    private static belongsToNestedRoot(path: string, root: string, allRoots: readonly string[]): boolean {
        return allRoots.some((other) => other !== root && PathUtilities.isInside(other, root) && PathUtilities.isInside(path, other));
    }

    private static pickManifestPath(root: string, files: readonly FileEntry[]): string {
        const candidates = files
            .filter(
                (file) =>
                    PathUtilities.directory(file.path) === root &&
                    PathUtilities.fileName(file.path).toLowerCase() === ModelBuilder.MANIFEST_NAME
            )
            .map((file) => file.path);
        const exact = candidates.find((path) => PathUtilities.fileName(path) === ModelBuilder.MANIFEST_NAME);

        return exact ?? candidates[0];
    }

    private static packTypeFromModules(modules: JsonValue | undefined): PackType | undefined {
        if (!JsonLoader.isArray(modules)) {
            return undefined;
        }

        const types = modules.map((module) => JsonLoader.get(module, "type")).filter((type): type is string => typeof type === "string");
        const priority: PackType[] = [
            PackItemLoader.WORLD_TEMPLATE_PACK_TYPE,
            PackItemLoader.PERSONA_PACK_TYPE,
            PackItemLoader.SKIN_PACK_TYPE,
            PackItemLoader.BEHAVIOR_PACK_TYPE,
            PackItemLoader.RESOURCE_PACK_TYPE,
        ];

        for (const candidate of priority) {
            if (types.some((type) => ModelBuilder.MODULE_TYPES[type.toLowerCase()] === candidate)) {
                return candidate;
            }
        }

        return undefined;
    }

    private static packTypeFromContents(root: string, files: readonly FileEntry[]): PackType {
        const relative = files
            .filter((file) => PathUtilities.isInside(file.path, root))
            .map((file) => PathUtilities.relativeTo(file.path, root).toLowerCase());

        if (relative.some((path) => path === ModelBuilder.LEVEL_DAT_NAME || path.startsWith("db/"))) {
            return PackItemLoader.WORLD_TEMPLATE_PACK_TYPE;
        }

        if (relative.some((path) => path === "skins.json")) {
            return PackItemLoader.SKIN_PACK_TYPE;
        }

        if (relative.some((path) => path.endsWith(PersonaFormat.META_SUFFIX))) {
            return PackItemLoader.PERSONA_PACK_TYPE;
        }

        if (relative.some((path) => path.startsWith("entities/") || path.startsWith("scripts/") || path.startsWith("functions/"))) {
            return PackItemLoader.BEHAVIOR_PACK_TYPE;
        }

        if (
            relative.some(
                (path) => path.startsWith(TextureFormat.TEXTURE_FOLDER) || path.startsWith("entity/") || path.startsWith("models/")
            )
        ) {
            return PackItemLoader.RESOURCE_PACK_TYPE;
        }

        return "unknown";
    }

    private static buildWorlds(files: readonly FileEntry[], packs: readonly Pack[]): World[] {
        const worldRoots = new Set<string>();

        for (const file of files) {
            if (PathUtilities.fileName(file.path).toLowerCase() === ModelBuilder.LEVEL_DAT_NAME) {
                worldRoots.add(PathUtilities.directory(file.path));
            }
        }

        for (const pack of packs) {
            if (pack.type === PackItemLoader.WORLD_TEMPLATE_PACK_TYPE) {
                worldRoots.add(pack.root);
            }
        }

        return [...worldRoots].sort().map((root) => ModelBuilder.buildWorld(root, files, packs));
    }

    private static buildWorld(root: string, files: readonly FileEntry[], packs: readonly Pack[]): World {
        const nestedPacks = packs.filter((pack) => pack.root !== root && PathUtilities.isInside(pack.root, root));
        const items: ContentItem[] = [];

        for (const file of files) {
            if (!PathUtilities.isInside(file.path, root)) {
                continue;
            }

            if (nestedPacks.some((pack) => PathUtilities.isInside(file.path, pack.root))) {
                continue;
            }

            const packPath = PathUtilities.relativeTo(file.path, root);

            items.push({
                kind: ItemClassifier.classify(PackItemLoader.WORLD_TEMPLATE_PACK_TYPE, packPath),
                path: file.path,
                packPath,
                size: file.size,
            });
        }

        return { root, items, packs: nestedPacks };
    }

    constructor(storage: Storage, layout: Layout, json: JsonLoader) {
        this.storage = storage;
        this.layout = layout;
        this.json = json;
    }

    async build(): Promise<ContentModel> {
        const allFiles = [...this.storage.listFiles()].sort((left, right) => left.path.localeCompare(right.path));
        const art = this.layout === "marketplace" ? ModelBuilder.discoverArt(allFiles) : [];
        const contentFiles = this.layout === "marketplace" ? allFiles.filter((file) => !ModelBuilder.isArtPath(file.path)) : allFiles;
        const manifestPaths = ModelBuilder.findManifests(contentFiles);
        const packRoots = await this.choosePackRoots(
            manifestPaths.map((path) => PathUtilities.directory(path)),
            contentFiles
        );
        const packs: Pack[] = [];

        for (const root of packRoots) {
            packs.push(await this.buildPack(root, contentFiles, packRoots));
        }

        const worlds = ModelBuilder.buildWorlds(contentFiles, packs);
        const pathsInPacks = new Set<string>();

        for (const pack of packs) {
            for (const item of pack.items) {
                pathsInPacks.add(item.path);
            }
        }

        for (const world of worlds) {
            for (const item of world.items) {
                pathsInPacks.add(item.path);
            }
        }

        const filesOutsidePacks = contentFiles.filter((file) => !pathsInPacks.has(file.path));

        return { storage: this.storage, packs, worlds, filesOutsidePacks, art, allFiles };
    }

    private async choosePackRoots(roots: readonly string[], files: readonly FileEntry[]): Promise<string[]> {
        const unique = [...new Set(roots)].sort((left, right) => left.length - right.length);
        const worldRoots = new Set<string>();

        for (const root of unique) {
            if (await this.isWorldRoot(root, files)) {
                worldRoots.add(root);
            }
        }

        const chosen: string[] = [];

        for (const root of unique) {
            const nestedInPack = chosen.some(
                (existing) =>
                    existing !== root &&
                    PathUtilities.isInside(root, existing) &&
                    !ModelBuilder.isPackContainerChild(root, existing, worldRoots)
            );

            if (!nestedInPack) {
                chosen.push(root);
            }
        }

        return chosen;
    }

    private async isWorldRoot(root: string, files: readonly FileEntry[]): Promise<boolean> {
        const hasLevelDat = files.some(
            (file) =>
                PathUtilities.directory(file.path) === root &&
                PathUtilities.fileName(file.path).toLowerCase() === ModelBuilder.LEVEL_DAT_NAME
        );

        if (hasLevelDat) {
            return true;
        }

        const manifest = await this.json.readObject(ModelBuilder.pickManifestPath(root, files));

        return ModelBuilder.packTypeFromModules(JsonLoader.get(manifest, "modules")) === PackItemLoader.WORLD_TEMPLATE_PACK_TYPE;
    }

    private async buildPack(root: string, files: readonly FileEntry[], allRoots: readonly string[]): Promise<Pack> {
        const manifestPath = ModelBuilder.pickManifestPath(root, files);
        const type = await this.detectPackType(manifestPath, root, files);
        const items: ContentItem[] = [];

        for (const file of files) {
            if (!PathUtilities.isInside(file.path, root) || ModelBuilder.belongsToNestedRoot(file.path, root, allRoots)) {
                continue;
            }

            const packPath = PathUtilities.relativeTo(file.path, root);

            items.push({ kind: ItemClassifier.classify(type, packPath), path: file.path, packPath, size: file.size });
        }

        return { root, type, manifestPath, items };
    }

    private async detectPackType(manifestPath: string, root: string, files: readonly FileEntry[]): Promise<PackType> {
        const manifest = await this.json.readObject(manifestPath);
        const modules = JsonLoader.get(manifest, "modules");
        const fromModules = ModelBuilder.packTypeFromModules(modules);

        if (fromModules !== undefined) {
            return fromModules;
        }

        return ModelBuilder.packTypeFromContents(root, files);
    }
}
