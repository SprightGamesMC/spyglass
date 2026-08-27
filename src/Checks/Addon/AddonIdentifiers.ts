import type { CollectedIdentifier, IdentifierPrefix, KeyedIdentifierSource } from "../../Types/AddonTypes.js";
import type { CheckContext } from "../../Types/CheckTypes.js";
import type { PackItem } from "../../Types/DefinitionTypes.js";
import type { JsonObject, JsonValue } from "../../Types/LoaderTypes.js";
import type { ItemKind } from "../../Types/ModelTypes.js";
import GeometryReader from "../../Loaders/GeometryReader.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import AddonNaming from "./AddonNaming.js";

export default abstract class AddonIdentifiers {
    static readonly ANIMATION_PREFIX: IdentifierPrefix = {
        prefix: ["animation"],
        label: "animation.creatorshortname_projectshortname.name",
    };
    static readonly ANIMATION_CONTROLLER_PREFIX: IdentifierPrefix = {
        prefix: ["controller", "animation"],
        label: "controller.animation.creatorshortname_projectshortname.name",
    };
    static readonly RENDER_CONTROLLER_PREFIX: IdentifierPrefix = {
        prefix: ["controller", "render"],
        label: "controller.render.creatorshortname_projectshortname.name",
    };
    static readonly GEOMETRY_PREFIX: IdentifierPrefix = { prefix: ["geometry"], label: "geometry.creatorshortname_projectshortname.name" };

    private static readonly KEYED_KINDS: Readonly<Partial<Record<ItemKind, KeyedIdentifierSource>>> = {
        animation_behavior: { key: "animations", prefix: AddonIdentifiers.ANIMATION_PREFIX },
        animation_resource: { key: "animations", prefix: AddonIdentifiers.ANIMATION_PREFIX },
        animation_controller_behavior: { key: "animation_controllers", prefix: AddonIdentifiers.ANIMATION_CONTROLLER_PREFIX },
        animation_controller_resource: { key: "animation_controllers", prefix: AddonIdentifiers.ANIMATION_CONTROLLER_PREFIX },
        render_controller: { key: "render_controllers", prefix: AddonIdentifiers.RENDER_CONTROLLER_PREFIX },
    };

    static async collect(context: CheckContext): Promise<CollectedIdentifier[]> {
        const collected: CollectedIdentifier[] = [];

        for (const item of PackItemLoader.select(context.model, AddonIdentifiers.kinds())) {
            const root = await context.loaders.json.readObject(item.item.path);

            if (root === undefined) {
                continue;
            }

            if (item.item.kind === "geometry") {
                collected.push(...AddonIdentifiers.geometryIdentifiers(item, root));
                continue;
            }

            const keyed = AddonIdentifiers.KEYED_KINDS[item.item.kind];

            if (keyed === undefined) {
                continue;
            }

            const section = root[keyed.key];

            if (!JsonLoader.isObject(section)) {
                continue;
            }

            for (const identifier of Object.keys(section)) {
                collected.push({ item, identifier, field: keyed.key + "." + identifier, prefix: keyed.prefix });
            }
        }

        return collected;
    }

    static hasPrefixForm(identifier: string, prefix: IdentifierPrefix): boolean {
        const parts = identifier.split(AddonNaming.PREFIX_SEPARATOR);

        if (parts.length < prefix.prefix.length + 1) {
            return false;
        }

        return prefix.prefix.every((expected, index) => parts[index] === expected);
    }

    static namespaceSegment(identifier: string, prefix: IdentifierPrefix): string {
        return identifier.split(AddonNaming.PREFIX_SEPARATOR)[prefix.prefix.length] ?? "";
    }

    private static kinds(): ItemKind[] {
        return [...(Object.keys(AddonIdentifiers.KEYED_KINDS) as ItemKind[]), "geometry"];
    }

    private static geometryIdentifiers(item: PackItem, root: JsonObject): CollectedIdentifier[] {
        const modern = root[GeometryReader.GEOMETRY_KEY];

        if (modern !== undefined) {
            return AddonIdentifiers.modernGeometryIdentifiers(item, modern);
        }

        const collected: CollectedIdentifier[] = [];

        for (const [key, entry] of Object.entries(root)) {
            if (!key.startsWith(GeometryReader.LEGACY_KEY_PREFIX) || !JsonLoader.isObject(entry)) {
                continue;
            }

            collected.push({ item, identifier: key, field: key, prefix: AddonIdentifiers.GEOMETRY_PREFIX });
        }

        return collected;
    }

    private static modernGeometryIdentifiers(item: PackItem, value: JsonValue): CollectedIdentifier[] {
        const entries = JsonLoader.isArray(value) ? value : [value];
        const collected: CollectedIdentifier[] = [];

        entries.forEach((entry, index) => {
            const identifier = JsonLoader.get(entry, "description", "identifier");

            if (typeof identifier !== "string") {
                return;
            }

            collected.push({
                item,
                identifier,
                field: GeometryReader.GEOMETRY_KEY + "[" + index + "].description.identifier",
                prefix: AddonIdentifiers.GEOMETRY_PREFIX,
            });
        });

        return collected;
    }
}
