import type { Layout } from "../../src/Types/CheckTypes.js";
import type { ContentModel } from "../../src/Types/ModelTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { ExpectedPack } from "../Types/ModelBuilderFindsPacksByManifestTypes.js";
import JsonLoader from "../../src/Loaders/JsonLoader.js";
import ModelBuilder from "../../src/Model/ModelBuilder.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ModelBuilderFindsPacksByManifest {
    static readonly ADDON_FILES: FixtureFiles = {
        "Content/behavior_packs/BP_X/manifest.json": ModelFixture.behaviorManifest(),
        "Content/behavior_packs/BP_X/entities/thing.json": {},
        "Content/resource_packs/RP_X/manifest.json": ModelFixture.resourceManifest(),
        "Content/resource_packs/RP_X/textures/entity/thing.png": "png",
        "Marketing Art/X_MarketingKeyArt.jpg": "jpg",
        "Store Art/x_Thumbnail_0.jpg": "jpg",
        "readme.txt": "outside",
    };

    static readonly WORLD_FILES: FixtureFiles = {
        "world/manifest.json": ModelFixture.worldTemplateManifest(),
        "world/level.dat": "dat",
        "world/db/CURRENT": "MANIFEST-000001",
        "world/behavior_packs/bp/manifest.json": ModelFixture.behaviorManifest(),
        "world/resource_packs/rp/manifest.json": ModelFixture.resourceManifest(),
    };

    static readonly MISNAMED_MANIFEST_FILES: FixtureFiles = {
        "pack/Manifest.json": ModelFixture.skinManifest(),
        "pack/skins.json": {},
    };

    static readonly NO_MODULE_FILES: FixtureFiles = {
        "pack/manifest.json": { format_version: 2, header: {} },
        "pack/entities/a.json": {},
    };

    static async build(files: FixtureFiles, layout: Layout): Promise<ContentModel> {
        const storage = ModelFixture.storage(files);

        return new ModelBuilder(storage, layout, new JsonLoader(storage)).build();
    }

    static packs(model: ContentModel): ExpectedPack[] {
        return model.packs.map((pack) => ({ root: pack.root, type: pack.type })).sort((left, right) => left.root.localeCompare(right.root));
    }

    static kinds(model: ContentModel, root: string): Record<string, string> {
        const pack = model.packs.find((entry) => entry.root === root);
        const kinds: Record<string, string> = {};

        for (const item of pack?.items ?? []) {
            kinds[item.packPath] = item.kind;
        }

        return kinds;
    }
}
