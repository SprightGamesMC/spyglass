import type Check from "../../../src/Checks/Check.js";
import type { FindingSummary, FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { ManifestCase, ManifestObject } from "../../Types/Manifest/ManifestFixtureTypes.js";
import ModelFixture from "../Core/ModelFixture.js";

export default abstract class ManifestFixture {
    static readonly WORLD_TEMPLATE_UUID = ModelFixture.WORLD_TEMPLATE_UUID;
    static readonly PACK_UUID = "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d";
    static readonly UNKNOWN_UUID = "4d5e6f7a-8b9c-4d0e-8f1a-2b3c4d5e6f7a";
    static readonly VALID_DEPENDENCIES: readonly ManifestObject[] = [
        { module_name: "@minecraft/server", version: "1.2.0" },
        { uuid: ManifestFixture.PACK_UUID, version: [1, 0, 0] },
    ];
    static readonly VALID_SUBPACKS: readonly ManifestObject[] = [
        { folder_name: "low", name: "Low", memory_tier: 1 },
        { folder_name: "high", name: "High", memory_tier: 4 },
    ];
    static readonly LABEL: ManifestObject = { type: "label", text: "Info" };
    static readonly TOGGLE: ManifestObject = { type: "toggle", text: "Toggle", name: "test:toggle", default: true };
    static readonly SLIDER: ManifestObject = { type: "slider", text: "Slider", name: "test:slider", min: 0, max: 10, step: 1, default: 5 };
    static readonly DROPDOWN: ManifestObject = {
        type: "dropdown",
        text: "Dropdown",
        name: "test:dropdown",
        default: "one",
        options: [
            { name: "one", text: "One" },
            { name: "two", text: "Two" },
        ],
    };
    static readonly VALID_SETTINGS: readonly ManifestObject[] = [
        ManifestFixture.LABEL,
        ManifestFixture.TOGGLE,
        ManifestFixture.SLIDER,
        ManifestFixture.DROPDOWN,
    ];

    static run(check: Check, entry: ManifestCase): Promise<FindingSummary> {
        return ModelFixture.summary(check, entry.files, entry.options ?? {});
    }

    static withHeader(manifest: ManifestObject, extra: ManifestObject): ManifestObject {
        return ModelFixture.withHeader(manifest, extra);
    }

    static withoutHeaderField(manifest: ManifestObject, field: string): ManifestObject {
        return { ...manifest, header: ManifestFixture.without(manifest.header as ManifestObject, field) };
    }

    static withoutField(manifest: ManifestObject, field: string): ManifestObject {
        return ManifestFixture.without(manifest, field);
    }

    static without(object: ManifestObject, field: string): ManifestObject {
        const copy = { ...object };

        delete copy[field];

        return copy;
    }

    static behaviorWithDependencies(dependencies: readonly ManifestObject[]): FixtureFiles {
        return { "BP/manifest.json": ModelFixture.behaviorManifest({ dependencies }) };
    }

    static behaviorWithSettings(settings: readonly ManifestObject[]): FixtureFiles {
        return { "BP/manifest.json": ModelFixture.behaviorManifest({ settings }) };
    }

    static behaviorWithModules(modules: readonly ManifestObject[]): FixtureFiles {
        return { "BP/manifest.json": ModelFixture.behaviorManifest({ modules }) };
    }

    static resourceWithSubpacks(subpacks: readonly ManifestObject[]): FixtureFiles {
        return { "RP/manifest.json": ModelFixture.resourceManifest({ subpacks }) };
    }

    static behaviorWithIcon(icon: Uint8Array | string): FixtureFiles {
        return { "BP/manifest.json": ModelFixture.behaviorManifest(), "BP/pack_icon.png": icon };
    }

    static behaviorWithMinEngineVersion(minEngineVersion: readonly number[]): FixtureFiles {
        return {
            "BP/manifest.json": ModelFixture.withHeader(ModelFixture.behaviorManifest(), { min_engine_version: minEngineVersion }),
        };
    }

    static resourceWithMinEngineVersion(minEngineVersion: readonly number[]): FixtureFiles {
        return {
            "RP/manifest.json": ModelFixture.withHeader(ModelFixture.resourceManifest(), { min_engine_version: minEngineVersion }),
        };
    }

    static worldTemplateWithMinEngineVersion(minEngineVersion: readonly number[]): FixtureFiles {
        return {
            "WT/manifest.json": ModelFixture.withHeader(ModelFixture.worldTemplateManifest(), { min_engine_version: minEngineVersion }),
        };
    }

    static resourceFormat1(minEngineVersion: readonly number[]): ManifestObject {
        return ModelFixture.withHeader(ModelFixture.resourceManifest({ format_version: 1 }), { min_engine_version: minEngineVersion });
    }

    static educationWorld(minEngineVersion: readonly number[]): FixtureFiles {
        return {
            "World/manifest.json": ModelFixture.worldTemplateManifest(),
            "World/education.json": {},
            "World/resource_packs/RP/manifest.json": ManifestFixture.resourceFormat1(minEngineVersion),
        };
    }

    static resourceWithTextureSet(
        overrides: ManifestObject,
        layers: readonly string[],
        minEngineVersion: readonly number[] = [1, 21, 120]
    ): FixtureFiles {
        const textureSet: Record<string, string> = {};

        for (const layer of layers) {
            textureSet[layer] = "stone_" + layer;
        }

        return {
            "RP/manifest.json": ModelFixture.withHeader(ModelFixture.resourceManifest(overrides), {
                min_engine_version: minEngineVersion,
            }),
            "RP/textures/blocks/stone.texture_set.json": { format_version: "1.16.100", "minecraft:texture_set": textureSet },
        };
    }
}
