import type { FoundIdentifier } from "../../Types/AddonTypes.js";
import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject, JsonValue } from "../../Types/LoaderTypes.js";
import type { ItemKind } from "../../Types/ModelTypes.js";
import Namespaces from "../../Data/Namespaces.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonNaming from "./AddonNaming.js";

export default class DefinitionIdentifierNotNamespaced extends Check {
    static readonly DEFINITION_KINDS: readonly ItemKind[] = [
        "entity_behavior",
        "item_behavior",
        "block_behavior",
        "recipe",
        "attachable",
        "particle",
        "spawn_rule",
        "feature",
        "feature_rule",
        "biome_behavior",
        "biome_resource",
        "fog",
        "camera_preset",
        "block_culling_rule",
        "jigsaw_structure",
        "template_pool",
        "structure_set",
        "processor_list",
        "aim_assist_preset",
        "aim_assist_category",
    ];
    static readonly IDENTIFIER_KEY = "identifier";
    static readonly DESCRIPTION_KEY = "description";
    static readonly CATEGORIES_KEY = "categories";
    static readonly NAME_KEY = "name";

    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.DEFINITION_IDENTIFIER_NOT_NAMESPACED,
        slug: "definition-identifier-not-namespaced",
        severity: "error",
        description: "Definition identifier is not namespaced",
    };

    private static identifiers(root: JsonObject): FoundIdentifier[] {
        const found: FoundIdentifier[] = [];
        const topLevel = root[DefinitionIdentifierNotNamespaced.IDENTIFIER_KEY];

        if (typeof topLevel === "string") {
            found.push({ identifier: topLevel, field: DefinitionIdentifierNotNamespaced.IDENTIFIER_KEY });
        }

        for (const [key, value] of Object.entries(root)) {
            if (!key.startsWith(Namespaces.VANILLA) || !JsonLoader.isObject(value)) {
                continue;
            }

            found.push(...DefinitionIdentifierNotNamespaced.identifiersUnder(key, value));
        }

        return found;
    }

    private static identifiersUnder(key: string, value: JsonObject): FoundIdentifier[] {
        const described = JsonLoader.get(
            value,
            DefinitionIdentifierNotNamespaced.DESCRIPTION_KEY,
            DefinitionIdentifierNotNamespaced.IDENTIFIER_KEY
        );

        if (typeof described === "string") {
            return [{ identifier: described, field: key + ".description.identifier" }];
        }

        const direct = value[DefinitionIdentifierNotNamespaced.IDENTIFIER_KEY];

        if (typeof direct === "string") {
            return [{ identifier: direct, field: key + ".identifier" }];
        }

        return DefinitionIdentifierNotNamespaced.categoryNames(key, value[DefinitionIdentifierNotNamespaced.CATEGORIES_KEY]);
    }

    private static categoryNames(key: string, categories: JsonValue | undefined): FoundIdentifier[] {
        if (!JsonLoader.isArray(categories)) {
            return [];
        }

        const found: FoundIdentifier[] = [];

        categories.forEach((category, index) => {
            const name = JsonLoader.get(category, DefinitionIdentifierNotNamespaced.NAME_KEY);

            if (typeof name !== "string") {
                return;
            }

            found.push({ identifier: name, field: key + ".categories[" + index + "].name" });
        });

        return found;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of PackItemLoader.select(context.model, DefinitionIdentifierNotNamespaced.DEFINITION_KINDS)) {
            const root = await context.loaders.json.readObject(entry.item.path);

            if (root === undefined) {
                continue;
            }

            for (const found of DefinitionIdentifierNotNamespaced.identifiers(root)) {
                if (AddonNaming.isNamespacedIdentifier(found.identifier)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Identifier " + found.identifier + " is not in creatorshortname_projectshortname:name form",
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
