import type Check from "../../../src/Checks/Check.js";
import type { FindingSummary, FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { SkinPackFixtureOptions } from "../../Types/Core/SkinFixtureTypes.js";
import ImageBytes from "./ImageBytes.js";
import ModelFixture from "./ModelFixture.js";

export default abstract class SkinPackFixture {
    static readonly ROOT = "SP";
    static readonly SKINS_JSON_PATH = SkinPackFixture.ROOT + "/skins.json";
    static readonly MANIFEST_PATH = SkinPackFixture.ROOT + "/manifest.json";
    static readonly ENGLISH_LANG_PATH = SkinPackFixture.ROOT + "/texts/en_US.lang";
    static readonly STEVE_TEXTURE = "steve_skin.png";
    static readonly ALEX_TEXTURE = "alex_skin.png";
    static readonly DEFAULT_LANG =
        "skinpack.sample_skin_pack=Sample Skin Pack\n" +
        "skin.sample_skin_pack.TestSkin1=Test Skin 1\n" +
        "skin.sample_skin_pack.TestSkin2=Test Skin 2\n";
    private static readonly SERIALIZE_NAME = "sample_skin_pack";

    static skin(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            localization_name: "TestSkin1",
            geometry: "geometry.humanoid.custom",
            texture: SkinPackFixture.STEVE_TEXTURE,
            type: "free",
            ...overrides,
        };
    }

    static paidSkins(count: number): Record<string, unknown>[] {
        return Array.from({ length: count }, (_, index) =>
            SkinPackFixture.skin({ localization_name: "Skin" + index, texture: "steve_" + index + ".png", type: "paid" })
        );
    }

    static freeSkins(count: number): Record<string, unknown>[] {
        return SkinPackFixture.paidSkins(count).map((skin) => ({ ...skin, type: "free" }));
    }

    static skinsJson(
        skins: readonly Record<string, unknown>[] = SkinPackFixture.defaultSkins(),
        overrides: Record<string, unknown> = {}
    ): object {
        return {
            serialize_name: SkinPackFixture.SERIALIZE_NAME,
            localization_name: SkinPackFixture.SERIALIZE_NAME,
            skins,
            ...overrides,
        };
    }

    static defaultTextures(): Record<string, Uint8Array> {
        return {
            [SkinPackFixture.STEVE_TEXTURE]: ImageBytes.png({ width: 64, height: 64 }),
            [SkinPackFixture.ALEX_TEXTURE]: ImageBytes.png({ width: 64, height: 64 }),
            "pack_icon.png": ImageBytes.png({ width: 256, height: 256 }),
        };
    }

    static run(check: Check, options: SkinPackFixtureOptions = {}): Promise<FindingSummary> {
        return ModelFixture.summary(check, SkinPackFixture.files(options), { contentType: "skin" });
    }

    private static defaultSkins(): Record<string, unknown>[] {
        return [
            SkinPackFixture.skin(),
            SkinPackFixture.skin({
                localization_name: "TestSkin2",
                geometry: "geometry.humanoid.customSlim",
                texture: SkinPackFixture.ALEX_TEXTURE,
                type: "paid",
            }),
        ];
    }

    private static files(options: SkinPackFixtureOptions = {}): FixtureFiles {
        const files: Record<string, Uint8Array | string | object> = { [SkinPackFixture.MANIFEST_PATH]: ModelFixture.skinManifest() };

        if (!options.omitSkinsJson) {
            files[SkinPackFixture.SKINS_JSON_PATH] = options.skinsJson ?? SkinPackFixture.skinsJson();
        }

        for (const [name, bytes] of Object.entries(options.textures ?? SkinPackFixture.defaultTextures())) {
            files[SkinPackFixture.ROOT + "/" + name] = bytes;
        }

        for (const [name, content] of Object.entries(options.langFiles ?? { "en_US.lang": SkinPackFixture.DEFAULT_LANG })) {
            files[SkinPackFixture.ROOT + "/texts/" + name] = content;
        }

        return files;
    }
}
