import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { DefinitionNameKeyMissingReportsDefinitionWithoutNameKeyCase } from "../Types/DefinitionNameKeyMissingReportsDefinitionWithoutNameKeyTypes.js";
import DefinitionNameKeyMissing from "../../src/Checks/Lang/DefinitionNameKeyMissing.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class DefinitionNameKeyMissingReportsDefinitionWithoutNameKey {
    static readonly ID = "LANG/104";
    static readonly ENTITY_PATH = "BP/entities/thing.json";
    static readonly ITEM_PATH = "BP/items/gem.json";
    static readonly BLOCK_PATH = "BP/blocks/ore.json";
    static readonly CASES: readonly DefinitionNameKeyMissingReportsDefinitionWithoutNameKeyCase[] = [
        {
            name: "spawnable entity has both the entity name key and the spawn egg key",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.entity(true),
            lang: "entity.custom:thing.name=Thing\nitem.spawn_egg.entity.custom:thing.name=Spawn Thing\n",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "spawnable entity has the entity name key but no spawn egg key",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.entity(true),
            lang: "entity.custom:thing.name=Thing\n",
            expectedIds: ["LANG/104"],
            expectedPaths: [DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.ENTITY_PATH],
        },
        {
            name: "entity that is not spawnable needs only the entity name key",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.entity(false),
            lang: "entity.custom:thing.name=Thing\n",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "item with the legacy item.custom:gem key and no .name suffix is accepted",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.item(undefined),
            lang: "item.custom:gem=Gem\n",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "item with a display_name component value present in the lang file is accepted",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.item("custom.gem.title"),
            lang: "custom.gem.title=Gem\n",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "item with no key in en_US.lang is reported",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.item(undefined),
            lang: "tile.custom:ore.name=Ore\n",
            expectedIds: ["LANG/104"],
            expectedPaths: [DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.ITEM_PATH],
        },
        {
            name: "block with the tile.custom:ore.name key is accepted",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.block(),
            lang: "tile.custom:ore.name=Ore\n",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "block whose key is only in fr_FR.lang is reported because only en_US.lang counts",
            definition: {
                ...DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.block(),
                "RP/texts/fr_FR.lang": "tile.custom:ore.name=Minerai\n",
            },
            lang: "entity.custom:thing.name=Thing\n",
            expectedIds: ["LANG/104"],
            expectedPaths: [DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.BLOCK_PATH],
        },
        {
            name: "minecraft:zombie identifier is skipped because the game provides vanilla keys",
            definition: {
                [DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.ENTITY_PATH]: {
                    "minecraft:entity": { description: { identifier: "minecraft:zombie", is_spawnable: true } },
                },
            },
            lang: "a=b\n",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "no en_US.lang in any pack skips the check and leaves it to LANG/101",
            definition: DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.block(),
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static entity(spawnable: boolean): FixtureFiles {
        return {
            [DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.ENTITY_PATH]: {
                "minecraft:entity": { description: { identifier: "custom:thing", is_spawnable: spawnable } },
            },
        };
    }

    static item(displayName: string | undefined): FixtureFiles {
        const components = displayName === undefined ? {} : { "minecraft:display_name": { value: displayName } };

        return {
            [DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.ITEM_PATH]: {
                "minecraft:item": { description: { identifier: "custom:gem" }, components },
            },
        };
    }

    static block(): FixtureFiles {
        return {
            [DefinitionNameKeyMissingReportsDefinitionWithoutNameKey.BLOCK_PATH]: {
                "minecraft:block": { description: { identifier: "custom:ore" }, components: {} },
            },
        };
    }

    static run(entry: DefinitionNameKeyMissingReportsDefinitionWithoutNameKeyCase): Promise<FindingSummary> {
        const lang: FixtureFiles = entry.lang === undefined ? {} : { "RP/texts/en_US.lang": entry.lang };
        const files: FixtureFiles = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "RP/manifest.json": ModelFixture.resourceManifest(),
            ...entry.definition,
            ...lang,
        };

        return ModelFixture.summary(new DefinitionNameKeyMissing(), files);
    }
}
