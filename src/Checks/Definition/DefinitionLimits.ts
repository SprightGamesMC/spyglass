import type { GameVersion } from "../../Types/LoaderTypes.js";
import type { ContentItem, ItemKind } from "../../Types/ModelTypes.js";
import type { Schema } from "../../Types/SchemaTypes.js";
import type Loaders from "../../Loaders/Loaders.js";
import BiomeSchema from "../../Data/Schemas/BiomeSchema.js";
import BlockSchema from "../../Data/Schemas/BlockSchema.js";
import ClientBiomeSchema from "../../Data/Schemas/ClientBiomeSchema.js";
import EntitySchema from "../../Data/Schemas/EntitySchema.js";
import FeatureRuleSchema from "../../Data/Schemas/FeatureRuleSchema.js";
import FeatureSchema from "../../Data/Schemas/FeatureSchema.js";
import FogSchema from "../../Data/Schemas/FogSchema.js";
import ItemSchema from "../../Data/Schemas/ItemSchema.js";
import RecipeSchema from "../../Data/Schemas/RecipeSchema.js";
import SpawnRuleSchema from "../../Data/Schemas/SpawnRuleSchema.js";

export default abstract class DefinitionLimits {
    static readonly CURRENT_RELEASE_KINDS: readonly ItemKind[] = [
        "entity_behavior",
        "item_behavior",
        "block_behavior",
        "recipe",
        "biome_behavior",
        "biome_resource",
        "feature",
        "feature_rule",
    ];
    static readonly VANILLA_KINDS: readonly ItemKind[] = ["fog", "spawn_rule", "render_controller", "texture_set"];
    static readonly ANIMATION_KINDS: readonly ItemKind[] = [
        "animation_behavior",
        "animation_controller_behavior",
        "animation_resource",
        "animation_controller_resource",
    ];
    static readonly EXACT_KINDS: readonly ItemKind[] = DefinitionLimits.ANIMATION_KINDS;
    static readonly EXACT_EXPECTED_VERSION: GameVersion = { major: 1, minor: 10, patch: 0 };
    static readonly FLOOR_VERSIONS: ReadonlyMap<ItemKind, GameVersion> = new Map<ItemKind, GameVersion>([
        ["attachable", { major: 1, minor: 10, patch: 0 }],
        ["entity_resource", { major: 1, minor: 10, patch: 0 }],
        ["particle", { major: 1, minor: 10, patch: 0 }],
        ["geometry", { major: 1, minor: 8, patch: 0 }],
    ]);
    static readonly FLOOR_KINDS: readonly ItemKind[] = [...DefinitionLimits.FLOOR_VERSIONS.keys()];
    static readonly BELOW_KINDS: readonly ItemKind[] = [
        ...DefinitionLimits.CURRENT_RELEASE_KINDS,
        ...DefinitionLimits.VANILLA_KINDS,
        ...DefinitionLimits.EXACT_KINDS,
        ...DefinitionLimits.FLOOR_KINDS,
    ];
    static readonly ABOVE_KINDS: readonly ItemKind[] = DefinitionLimits.BELOW_KINDS;
    static readonly MISSING_KINDS: readonly ItemKind[] = DefinitionLimits.BELOW_KINDS;
    static readonly SCHEMAS: ReadonlyMap<ItemKind, Schema> = new Map<ItemKind, Schema>([
        ["entity_behavior", EntitySchema.SCHEMA],
        ["item_behavior", ItemSchema.SCHEMA],
        ["block_behavior", BlockSchema.SCHEMA],
        ["recipe", RecipeSchema.SCHEMA],
        ["spawn_rule", SpawnRuleSchema.SCHEMA],
        ["fog", FogSchema.SCHEMA],
        ["biome_behavior", BiomeSchema.SCHEMA],
        ["biome_resource", ClientBiomeSchema.SCHEMA],
        ["feature", FeatureSchema.SCHEMA],
        ["feature_rule", FeatureRuleSchema.SCHEMA],
    ]);
    static readonly SCHEMA_KINDS: readonly ItemKind[] = [...DefinitionLimits.SCHEMAS.keys()];
    static readonly CURRENT_RELEASE_SCHEMA_KINDS: readonly ItemKind[] = ["entity_behavior", "item_behavior", "block_behavior"];
    static readonly IDENTIFIER_KINDS: readonly ItemKind[] = [
        "entity_behavior",
        "item_behavior",
        "block_behavior",
        "recipe",
        "spawn_rule",
        "biome_behavior",
        "feature",
        "feature_rule",
    ];
    private static readonly IDENTIFIER_TAIL: readonly string[] = ["description", "identifier"];

    static identifierPath(rootKey: string): readonly string[] {
        return [rootKey, ...DefinitionLimits.IDENTIFIER_TAIL];
    }

    static belowExpectedVersion(item: ContentItem, loaders: Loaders): GameVersion {
        const floor = DefinitionLimits.FLOOR_VERSIONS.get(item.kind);

        if (floor !== undefined) {
            return floor;
        }

        return DefinitionLimits.aboveExpectedVersion(item, loaders);
    }

    static aboveExpectedVersion(item: ContentItem, loaders: Loaders): GameVersion {
        if (DefinitionLimits.EXACT_KINDS.includes(item.kind)) {
            return DefinitionLimits.EXACT_EXPECTED_VERSION;
        }

        if (DefinitionLimits.VANILLA_KINDS.includes(item.kind)) {
            return loaders.vanilla.maxFormatVersion(item.kind) ?? loaders.currentGameVersion;
        }

        return loaders.currentGameVersion;
    }

    static belowComparesExactly(item: ContentItem): boolean {
        return DefinitionLimits.EXACT_KINDS.includes(item.kind) || DefinitionLimits.FLOOR_VERSIONS.has(item.kind);
    }

    static aboveComparesExactly(item: ContentItem): boolean {
        return DefinitionLimits.EXACT_KINDS.includes(item.kind);
    }
}
