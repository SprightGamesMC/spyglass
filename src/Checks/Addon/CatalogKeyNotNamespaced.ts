import type { CatalogKey } from "../../Types/AddonTypes.js";
import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject, JsonValue } from "../../Types/LoaderTypes.js";
import type { ItemKind } from "../../Types/ModelTypes.js";
import JsonKeys from "../../Data/JsonKeys.js";
import SoundDefinitionsSchema from "../../Data/Schemas/SoundDefinitionsSchema.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonNaming from "./AddonNaming.js";

export default class CatalogKeyNotNamespaced extends Check {
    static readonly CATALOG_KINDS: readonly ItemKind[] = [
        "sound_definitions",
        "terrain_texture",
        "item_texture",
        "flipbook_textures",
        "crafting_item_catalog",
    ];
    static readonly TEXTURE_DATA_KEY = "texture_data";
    static readonly ATLAS_TILE_KEY = "atlas_tile";
    static readonly CRAFTING_CATALOG_KEY = "minecraft:crafting_items_catalog";

    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.CATALOG_KEY_NOT_NAMESPACED,
        slug: "catalog-key-not-namespaced",
        severity: "error",
        description: "Catalog key is not namespaced",
    };

    private static keys(kind: ItemKind, value: JsonValue | undefined): CatalogKey[] {
        if (kind === "sound_definitions") {
            return CatalogKeyNotNamespaced.soundKeys(value);
        }

        if (kind === "flipbook_textures") {
            return CatalogKeyNotNamespaced.flipbookKeys(value);
        }

        if (kind === "crafting_item_catalog") {
            return CatalogKeyNotNamespaced.craftingGroupKeys(value);
        }

        return CatalogKeyNotNamespaced.objectKeys(
            JsonLoader.get(value, CatalogKeyNotNamespaced.TEXTURE_DATA_KEY),
            CatalogKeyNotNamespaced.TEXTURE_DATA_KEY
        );
    }

    private static soundKeys(value: JsonValue | undefined): CatalogKey[] {
        const nested = JsonLoader.get(value, SoundDefinitionsSchema.DEFINITIONS_KEY);

        if (JsonLoader.isObject(nested)) {
            return CatalogKeyNotNamespaced.objectKeys(nested, SoundDefinitionsSchema.DEFINITIONS_KEY);
        }

        if (!JsonLoader.isObject(value)) {
            return [];
        }

        const legacy: JsonObject = { ...value };

        delete legacy[JsonKeys.FORMAT_VERSION];

        return CatalogKeyNotNamespaced.objectKeys(legacy, "");
    }

    private static flipbookKeys(value: JsonValue | undefined): CatalogKey[] {
        if (!JsonLoader.isArray(value)) {
            return [];
        }

        const found: CatalogKey[] = [];

        value.forEach((entry, index) => {
            const tile = JsonLoader.get(entry, CatalogKeyNotNamespaced.ATLAS_TILE_KEY);

            if (typeof tile !== "string") {
                return;
            }

            found.push({ key: tile, field: "[" + index + "]." + CatalogKeyNotNamespaced.ATLAS_TILE_KEY });
        });

        return found;
    }

    private static craftingGroupKeys(value: JsonValue | undefined): CatalogKey[] {
        const categories = JsonLoader.get(value, CatalogKeyNotNamespaced.CRAFTING_CATALOG_KEY, "categories");

        if (!JsonLoader.isArray(categories)) {
            return [];
        }

        const found: CatalogKey[] = [];

        categories.forEach((category, categoryIndex) => {
            const groups = JsonLoader.get(category, "groups");

            if (!JsonLoader.isArray(groups)) {
                return;
            }

            groups.forEach((group, groupIndex) => {
                const name = JsonLoader.get(group, "group_identifier", "name");

                if (typeof name !== "string") {
                    return;
                }

                found.push({ key: name, field: "categories[" + categoryIndex + "].groups[" + groupIndex + "].group_identifier.name" });
            });
        });

        return found;
    }

    private static objectKeys(value: JsonValue | undefined, field: string): CatalogKey[] {
        if (!JsonLoader.isObject(value)) {
            return [];
        }

        const prefix = field === "" ? "" : field + ".";

        return Object.keys(value).map((key) => ({ key, field: prefix + key }));
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of PackItemLoader.select(context.model, CatalogKeyNotNamespaced.CATALOG_KINDS)) {
            const value = await context.loaders.json.readValue(entry.item.path);

            for (const found of CatalogKeyNotNamespaced.keys(entry.item.kind, value)) {
                if (AddonNaming.isNamespacedCatalogKey(found.key)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Catalog key " +
                            found.key +
                            " is not in creatorshortname_projectshortname:name or creatorshortname_projectshortname_name form",
                        entry.item.path,
                        entry.pack.root,
                        { field: found.field }
                    )
                );
            }
        }

        return findings;
    }
}
