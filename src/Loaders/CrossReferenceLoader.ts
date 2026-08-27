import type { CheckContext } from "../Types/CheckTypes.js";
import type { CrossReferenceIndex, LinkCollection, LinkKind, LinkReference, LinkResolution } from "../Types/CrossReferenceTypes.js";
import type { Pack } from "../Types/ModelTypes.js";
import Namespaces from "../Data/Namespaces.js";
import PathUtilities from "../Storage/PathUtilities.js";
import CrossReferenceCollector from "./CrossReferenceCollector.js";
import SoundFormat from "./SoundFormat.js";
import SubpackFormat from "./SubpackFormat.js";

export default abstract class CrossReferenceLoader {
    private static readonly CACHE_KEY = "cross-reference-index";

    static load(context: CheckContext): Promise<CrossReferenceIndex> {
        return context.loaders.cached(CrossReferenceLoader.CACHE_KEY, () => CrossReferenceLoader.build(context));
    }

    static resolve(context: CheckContext, index: CrossReferenceIndex, reference: LinkReference): LinkResolution {
        if (reference.kind === "texture_prefix") {
            return "defined";
        }

        if (index.definedIds.get(reference.kind)?.has(reference.id) === true) {
            return "defined";
        }

        if (CrossReferenceLoader.isVanilla(context, reference.kind, reference.id)) {
            return "vanilla";
        }

        return "missing";
    }

    static describeKind(kind: LinkKind): string {
        return kind.replaceAll("_", " ");
    }

    private static async build(context: CheckContext): Promise<CrossReferenceIndex> {
        const collection: LinkCollection = { definitions: [], references: [] };

        for (const pack of context.model.packs) {
            await CrossReferenceLoader.collectPack(context, pack, collection);
        }

        const definedIds = new Map<LinkKind, Set<string>>();

        for (const definition of collection.definitions) {
            const ids = definedIds.get(definition.kind) ?? new Set<string>();

            ids.add(definition.id);
            definedIds.set(definition.kind, ids);
        }

        return { references: collection.references, definedIds };
    }

    private static async collectPack(context: CheckContext, pack: Pack, collection: LinkCollection): Promise<void> {
        for (const item of pack.items) {
            if (item.kind === "texture" || item.kind === "sound") {
                CrossReferenceLoader.defineAsset(pack, item.kind, item.path, item.packPath, collection);
                continue;
            }

            const value = await context.loaders.json.readValue(item.path);

            if (value === undefined) {
                continue;
            }

            new CrossReferenceCollector(pack, item, value, collection).collect();
        }
    }

    private static defineAsset(pack: Pack, kind: LinkKind, path: string, packPath: string, collection: LinkCollection): void {
        const id = PathUtilities.normalizeReference(SubpackFormat.pathWithoutSubpack(packPath));

        if (id === undefined) {
            return;
        }

        collection.definitions.push({ kind, id, path, pack: pack.root });
    }

    private static isVanilla(context: CheckContext, kind: LinkKind, id: string): boolean {
        switch (kind) {
            case "texture":
                return context.loaders.vanilla.hasTexturePath(id);
            case "sound":
                return (
                    SoundFormat.FILE_EXTENSIONS.some((extension) => context.loaders.vanilla.hasPath(id + "." + extension)) ||
                    context.loaders.vanilla.hasSoundPath(id)
                );
            case "sound_event":
                return context.loaders.vanilla.hasSoundEvent(id);
            case "geometry":
            case "animation":
            case "render_controller":
                return context.loaders.vanilla.hasDefinitionId(kind, id);
            case "entity":
            case "item":
            case "particle":
                return id.startsWith(Namespaces.VANILLA);
            default:
                return false;
        }
    }
}
