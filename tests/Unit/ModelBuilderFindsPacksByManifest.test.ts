import assert from "node:assert/strict";
import { test } from "node:test";
import ModelBuilderFindsPacksByManifest from "../Helpers/ModelBuilderFindsPacksByManifest.js";

test("marketplace layout finds BP_X and RP_X by manifest search and types them by module", async () => {
    const model = await ModelBuilderFindsPacksByManifest.build(ModelBuilderFindsPacksByManifest.ADDON_FILES, "marketplace");

    assert.deepEqual(ModelBuilderFindsPacksByManifest.packs(model), [
        { root: "Content/behavior_packs/BP_X", type: "behavior" },
        { root: "Content/resource_packs/RP_X", type: "resource" },
    ]);
    assert.deepEqual(ModelBuilderFindsPacksByManifest.kinds(model, "Content/behavior_packs/BP_X"), {
        "manifest.json": "manifest",
        "entities/thing.json": "entity_behavior",
    });
    assert.deepEqual(model.art.map((file) => file.folder + ":" + file.name).sort(), [
        "Marketing Art:X_MarketingKeyArt.jpg",
        "Store Art:x_Thumbnail_0.jpg",
    ]);
    assert.deepEqual(
        model.filesOutsidePacks.map((file) => file.path),
        ["readme.txt"]
    );
});

test("standard layout treats Marketing Art and Store Art files as files outside packs", async () => {
    const model = await ModelBuilderFindsPacksByManifest.build(ModelBuilderFindsPacksByManifest.ADDON_FILES, "standard");

    assert.equal(model.art.length, 0);
    assert.equal(model.filesOutsidePacks.length, 3);
});

test("world template contains its behavior_packs and resource_packs packs and classifies db/CURRENT as database", async () => {
    const model = await ModelBuilderFindsPacksByManifest.build(ModelBuilderFindsPacksByManifest.WORLD_FILES, "standard");

    assert.deepEqual(ModelBuilderFindsPacksByManifest.packs(model), [
        { root: "world", type: "world_template" },
        { root: "world/behavior_packs/bp", type: "behavior" },
        { root: "world/resource_packs/rp", type: "resource" },
    ]);
    assert.equal(model.worlds.length, 1);
    assert.equal(model.worlds[0].root, "world");
    assert.equal(model.worlds[0].packs.length, 2);
    assert.deepEqual(ModelBuilderFindsPacksByManifest.kinds(model, "world")["db/CURRENT"], "database");
});

test("Manifest.json with a capital M still discovers the skin pack", async () => {
    const model = await ModelBuilderFindsPacksByManifest.build(ModelBuilderFindsPacksByManifest.MISNAMED_MANIFEST_FILES, "standard");

    assert.deepEqual(ModelBuilderFindsPacksByManifest.packs(model), [{ root: "pack", type: "skin" }]);
    assert.equal(model.packs[0].manifestPath, "pack/Manifest.json");
});

test("manifest without modules gets the behavior type from its entities folder", async () => {
    const model = await ModelBuilderFindsPacksByManifest.build(ModelBuilderFindsPacksByManifest.NO_MODULE_FILES, "standard");

    assert.deepEqual(ModelBuilderFindsPacksByManifest.packs(model), [{ root: "pack", type: "behavior" }]);
});
