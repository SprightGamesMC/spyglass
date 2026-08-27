import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { ContentItem, Pack } from "../../Types/ModelTypes.js";
import Namespaces from "../../Data/Namespaces.js";
import BlockSchema from "../../Data/Schemas/BlockSchema.js";
import EntitySchema from "../../Data/Schemas/EntitySchema.js";
import ItemSchema from "../../Data/Schemas/ItemSchema.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";
import LangLimits from "./LangLimits.js";

export default class DefinitionNameKeyMissing extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.DEFINITION_NAME_KEY_MISSING,
        slug: "definition-name-key-missing",
        severity: "warning",
        description: "Entity, item, or block has no name key in en_US.lang",
        contentTypes: ["addon", "world"],
    };

    private static readonly IDENTIFIER_FIELD = "description.identifier";

    private static async readKeys(context: CheckContext): Promise<Set<string> | undefined> {
        let keys: Set<string> | undefined;

        for (const pack of context.model.packs) {
            for (const item of pack.items) {
                if (item.kind !== "lang" || PathUtilities.fileName(item.packPath) !== LangLimits.PRIMARY_LANG_FILE) {
                    continue;
                }

                const entries = await context.loaders.text.readLangEntries(item.path);

                if (entries === undefined) {
                    continue;
                }

                keys ??= new Set<string>();

                for (const key of entries.keys()) {
                    keys.add(key);
                }
            }
        }

        return keys;
    }

    private static displayNameKey(root: JsonObject, rootKey: string): string | undefined {
        const value = JsonLoader.get(root, rootKey, "components", LangLimits.DISPLAY_NAME_COMPONENT, "value");

        return typeof value === "string" ? value : undefined;
    }

    private static acceptedKeys(item: ContentItem, root: JsonObject, id: string): string[][] {
        if (item.kind === "entity_behavior") {
            const groups = [[LangLimits.ENTITY_KEY_PREFIX + id + LangLimits.NAME_KEY_SUFFIX]];

            if (JsonLoader.get(root, EntitySchema.ROOT_KEY, "description", "is_spawnable") === true) {
                groups.push([LangLimits.SPAWN_EGG_KEY_PREFIX + id + LangLimits.NAME_KEY_SUFFIX]);
            }

            return groups;
        }

        if (item.kind === "item_behavior") {
            const display = DefinitionNameKeyMissing.displayNameKey(root, ItemSchema.ROOT_KEY);
            const keys = [LangLimits.ITEM_KEY_PREFIX + id + LangLimits.NAME_KEY_SUFFIX, LangLimits.ITEM_KEY_PREFIX + id];

            return [display === undefined ? keys : [display]];
        }

        const display = DefinitionNameKeyMissing.displayNameKey(root, BlockSchema.ROOT_KEY);

        return [display === undefined ? [LangLimits.BLOCK_KEY_PREFIX + id + LangLimits.NAME_KEY_SUFFIX] : [display]];
    }

    private static rootKey(item: ContentItem): string {
        if (item.kind === "entity_behavior") {
            return EntitySchema.ROOT_KEY;
        }

        return item.kind === "item_behavior" ? ItemSchema.ROOT_KEY : BlockSchema.ROOT_KEY;
    }

    private static describe(item: ContentItem): string {
        if (item.kind === "entity_behavior") {
            return "Entity";
        }

        return item.kind === "item_behavior" ? "Item" : "Block";
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const keys = await DefinitionNameKeyMissing.readKeys(context);

        if (keys === undefined) {
            return [];
        }

        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            for (const item of pack.items) {
                if (item.kind !== "entity_behavior" && item.kind !== "item_behavior" && item.kind !== "block_behavior") {
                    continue;
                }

                findings.push(...(await this.check(context, pack, item, keys)));
            }
        }

        return findings;
    }

    private async check(context: CheckContext, pack: Pack, item: ContentItem, keys: ReadonlySet<string>): Promise<Finding[]> {
        const root = await context.loaders.json.readObject(item.path);

        if (root === undefined) {
            return [];
        }

        const id = JsonLoader.get(root, DefinitionNameKeyMissing.rootKey(item), "description", "identifier");

        if (typeof id !== "string" || id.startsWith(Namespaces.VANILLA)) {
            return [];
        }

        const findings: Finding[] = [];

        for (const group of DefinitionNameKeyMissing.acceptedKeys(item, root, id)) {
            if (group.some((key) => keys.has(key))) {
                continue;
            }

            findings.push(
                this.finding(
                    DefinitionNameKeyMissing.describe(item) +
                        " " +
                        id +
                        " has no " +
                        group[0] +
                        " key in any " +
                        LangLimits.PRIMARY_LANG_FILE,
                    item.path,
                    pack.root,
                    { field: DefinitionNameKeyMissing.IDENTIFIER_FIELD }
                )
            );
        }

        return findings;
    }
}
