import type Check from "../../../src/Checks/Check.js";
import type { CheckContext, Finding } from "../../../src/Types/CheckTypes.js";
import type { PackType } from "../../../src/Types/ModelTypes.js";
import type { FindingSummary, FixtureFiles, FixtureOptions, RunResult } from "../../Types/Core/FixtureTypes.js";
import Loaders from "../../../src/Loaders/Loaders.js";
import VanillaLoader from "../../../src/Loaders/VanillaLoader.js";
import ModelBuilder from "../../../src/Model/ModelBuilder.js";
import MemoryStorage from "./MemoryStorage.js";

export default abstract class ModelFixture {
    static readonly DEFAULT_GAME_VERSION = VanillaLoader.sourceGameVersion();
    static readonly FICTIONAL_GAME_VERSION = "10.30.20";
    static readonly FICTIONAL_GAME_VERSION_ARRAY: readonly number[] = ModelFixture.FICTIONAL_GAME_VERSION.split(".").map(Number);
    static readonly BEHAVIOR_UUID = "6f2a5c2e-1d2b-4c3a-9e8f-0a1b2c3d4e5f";
    static readonly RESOURCE_UUID = "8b4c7e4a-3f4d-4e5c-9a0b-2c3d4e5f6a7b";
    static readonly OTHER_UUID = "00000000-0000-4000-8000-000000000000";
    static readonly WORLD_TEMPLATE_UUID = "cf80bc8e-7d8b-4c9a-9e4f-6a7b8c9daebf";
    private static readonly EMPTY_VANILLA = { files: {}, properties: {} };

    static storage(files: FixtureFiles, unreadable: readonly string[] = []): MemoryStorage {
        const storage = new MemoryStorage();

        for (const [path, content] of Object.entries(files)) {
            if (typeof content === "string" || content instanceof Uint8Array) {
                storage.addFile(path, content);
                continue;
            }

            storage.addJson(path, content);
        }

        for (const path of unreadable) {
            storage.addUnreadable(path);
        }

        return storage;
    }

    static async run(check: Check, files: FixtureFiles, options: FixtureOptions = {}): Promise<RunResult> {
        const context = await ModelFixture.context(files, options);
        const findings = await check.run(context);

        return { context, findings };
    }

    static ids(findings: readonly Finding[]): string[] {
        return findings.map((finding) => finding.id);
    }

    static async findings(check: Check, files: FixtureFiles, options: FixtureOptions = {}): Promise<Finding[]> {
        const result = await ModelFixture.run(check, files, options);

        return [...result.findings];
    }

    static async summary(check: Check, files: FixtureFiles, options: FixtureOptions = {}): Promise<FindingSummary> {
        const findings = await ModelFixture.findings(check, files, options);

        return { ids: ModelFixture.sortedIds(findings), fields: ModelFixture.fields(findings), paths: ModelFixture.paths(findings) };
    }

    static sortedIds(findings: readonly Finding[]): string[] {
        return ModelFixture.ids(findings).sort();
    }

    static fields(findings: readonly Finding[]): string[] {
        return findings.map((finding) => finding.location?.field ?? "").sort();
    }

    static messages(findings: readonly Finding[]): string[] {
        return findings.map((finding) => finding.message).sort();
    }

    static paths(findings: readonly Finding[]): string[] {
        return findings.map((finding) => finding.path ?? "").sort();
    }

    static behaviorManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            format_version: 2,
            header: {
                name: "Test BP",
                description: "Test",
                uuid: ModelFixture.BEHAVIOR_UUID,
                version: [1, 0, 0],
                min_engine_version: [1, 21, 0],
            },
            modules: [{ type: "data", uuid: "7a3b6d3f-2e3c-4d4b-8f9a-1b2c3d4e5f6a", version: [1, 0, 0] }],
            ...overrides,
        };
    }

    static resourceManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            format_version: 2,
            header: {
                name: "Test RP",
                description: "Test",
                uuid: ModelFixture.RESOURCE_UUID,
                version: [1, 0, 0],
                min_engine_version: [1, 21, 0],
            },
            modules: [{ type: "resources", uuid: "9c5d8f5b-4a5e-4f6d-8b1c-3d4e5f6a7b8c", version: [1, 0, 0] }],
            ...overrides,
        };
    }

    static skinManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            format_version: 1,
            header: { name: "Test Skins", uuid: "ad6e9a6c-5b6f-4a7e-9c2d-4e5f6a7b8c9d", version: [1, 0, 0] },
            modules: [{ type: "skin_pack", uuid: "be7fab7d-6c7a-4b8f-8d3e-5f6a7b8c9dae", version: [1, 0, 0] }],
            ...overrides,
        };
    }

    static worldTemplateManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            format_version: 2,
            header: {
                name: "Test World",
                description: "Test",
                uuid: ModelFixture.WORLD_TEMPLATE_UUID,
                version: [1, 0, 0],
                base_game_version: [1, 21, 0],
                lock_template_options: true,
            },
            modules: [{ type: "world_template", uuid: "d091cd9f-8e9c-4dab-8f5a-7b8c9daebfc0", version: [1, 0, 0] }],
            ...overrides,
        };
    }

    static personaManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            format_version: 1,
            header: {
                name: "pack.name",
                description: "pack.description",
                uuid: "e1a2dea0-9fad-4ebc-9a6b-8c9daebfc0d1",
                version: [1, 0, 0],
            },
            modules: [{ type: "persona_piece", uuid: "f2b3efb1-abbe-4fcd-8b7c-9daebfc0d1e2", version: [1, 0, 0] }],
            ...overrides,
        };
    }

    static withHeader(manifest: Record<string, unknown>, extra: Record<string, unknown>): Record<string, unknown> {
        return { ...manifest, header: { ...(manifest.header as Record<string, unknown>), ...extra } };
    }

    static manifestFor(packType: PackType): Record<string, unknown> {
        if (packType === "resource") {
            return ModelFixture.resourceManifest();
        }

        if (packType === "skin") {
            return ModelFixture.skinManifest();
        }

        if (packType === "persona") {
            return ModelFixture.personaManifest();
        }

        if (packType === "world_template") {
            return ModelFixture.worldTemplateManifest();
        }

        return ModelFixture.behaviorManifest();
    }

    private static async context(files: FixtureFiles, options: FixtureOptions = {}): Promise<CheckContext> {
        const storage = ModelFixture.storage(files, options.unreadable);
        const layout = options.layout ?? "standard";
        const loaders = new Loaders(
            storage,
            {
                currentGameVersion: options.currentGameVersion ?? ModelFixture.DEFAULT_GAME_VERSION,
                betaModuleVersions: options.betaModuleVersions ?? {},
            },
            new VanillaLoader(options.vanilla ?? ModelFixture.EMPTY_VANILLA)
        );
        const model = await new ModelBuilder(storage, layout, loaders.json).build();

        return { model, loaders, contentType: options.contentType ?? "addon" };
    }
}
