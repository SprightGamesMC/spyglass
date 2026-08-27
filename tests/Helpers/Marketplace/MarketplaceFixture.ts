import type Check from "../../../src/Checks/Check.js";
import type { ContentType, Finding } from "../../../src/Types/CheckTypes.js";
import type { FindingSummary, FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { MarketplaceCase, PackReference } from "../../Types/Marketplace/MarketplaceFixtureTypes.js";
import ArtLimits from "../../../src/Checks/Art/ArtLimits.js";
import ImageBytes from "../Core/ImageBytes.js";
import ModelFixture from "../Core/ModelFixture.js";

export default abstract class MarketplaceFixture {
    static readonly NAME = "TestPack";
    static readonly LOWER_NAME = "testpack";
    static readonly PIECE_ID = "my.piece";
    static readonly EMOTE_ID = "em_wave";
    static readonly BEHAVIOR_ROOT = "Content/behavior_packs/BP_TST";
    static readonly RESOURCE_ROOT = "Content/resource_packs/RP_TST";
    static readonly WORLD_ROOT = "Content/world_template";
    static readonly WORLD_BEHAVIOR_ROOT = "Content/world_template/behavior_packs/BP_TST";
    static readonly WORLD_RESOURCE_ROOT = "Content/world_template/resource_packs/RP_TST";
    static readonly WORLD_BEHAVIOR_REFERENCES = "Content/world_template/world_behavior_packs.json";
    static readonly WORLD_RESOURCE_REFERENCES = "Content/world_template/world_resource_packs.json";
    static readonly SKIN_ROOT = "Content/skin_pack";
    static readonly PERSONA_ROOT = "Content/persona";
    static readonly MARKETING_FOLDER = ArtLimits.MARKETING_FOLDER;
    static readonly STORE_FOLDER = ArtLimits.STORE_FOLDER;
    static readonly BEHAVIOR_MANIFEST = MarketplaceFixture.BEHAVIOR_ROOT + "/manifest.json";
    static readonly RESOURCE_MANIFEST = MarketplaceFixture.RESOURCE_ROOT + "/manifest.json";
    static readonly KEY_ART = MarketplaceFixture.marketingPath("TestPack_MarketingKeyArt.jpg");
    static readonly PSD_KEY_ART = MarketplaceFixture.marketingPath("TestPack_MarketingKeyArt.psd");
    static readonly PARTNER_ART = MarketplaceFixture.marketingPath("TestPack_PartnerArt.jpg");
    static readonly THUMBNAIL = MarketplaceFixture.storePath("testpack_Thumbnail_0.jpg");
    static readonly PANORAMA = MarketplaceFixture.storePath("testpack_panorama_0.jpg");
    static readonly PACK_ICON = MarketplaceFixture.storePath("testpack_packicon_0.jpg");
    static readonly APPROVAL_SHEET = MarketplaceFixture.marketingPath(MarketplaceFixture.PIECE_ID + "_ApprovalSheet.png");
    static readonly PERSONA_THUMBNAIL = MarketplaceFixture.storePath(MarketplaceFixture.PIECE_ID + "_Thumbnail_0.png");
    static readonly EMOTE_GIF = MarketplaceFixture.marketingPath(MarketplaceFixture.EMOTE_ID + ".gif");
    static readonly PREVIEW_GIF = ImageBytes.gif({ width: 64, height: 64 });
    static readonly SIDELOAD_PACK = new Uint8Array([0x50, 0x4b, 0x05, 0x06]);
    static readonly SCREENSHOT_COUNT = 5;

    static marketingPath(fileName: string): string {
        return MarketplaceFixture.MARKETING_FOLDER + "/" + fileName;
    }

    static storePath(fileName: string): string {
        return MarketplaceFixture.STORE_FOLDER + "/" + fileName;
    }

    static behaviorManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return ModelFixture.behaviorManifest({ metadata: { product_type: "addon" }, ...overrides });
    }

    static resourceManifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        const base = ModelFixture.resourceManifest({ metadata: { product_type: "addon" } });

        return { ...ModelFixture.withHeader(base, { pack_scope: "world" }), ...overrides };
    }

    static addonPacks(): FixtureFiles {
        return {
            [MarketplaceFixture.BEHAVIOR_MANIFEST]: MarketplaceFixture.behaviorManifest(),
            [MarketplaceFixture.RESOURCE_MANIFEST]: MarketplaceFixture.resourceManifest(),
        };
    }

    static behaviorReferences(entries?: readonly PackReference[]): readonly PackReference[] {
        return entries ?? [{ pack_id: ModelFixture.BEHAVIOR_UUID, version: [1, 0, 0] }];
    }

    static resourceReferences(entries?: readonly PackReference[]): readonly PackReference[] {
        return entries ?? [{ pack_id: ModelFixture.RESOURCE_UUID, version: [1, 0, 0] }];
    }

    static worldFiles(): FixtureFiles {
        return {
            [MarketplaceFixture.WORLD_ROOT + "/manifest.json"]: ModelFixture.worldTemplateManifest(),
            [MarketplaceFixture.WORLD_ROOT + "/level.dat"]: new Uint8Array([0, 0, 0, 0]),
            [MarketplaceFixture.WORLD_BEHAVIOR_REFERENCES]: MarketplaceFixture.behaviorReferences(),
            [MarketplaceFixture.WORLD_RESOURCE_REFERENCES]: MarketplaceFixture.resourceReferences(),
            [MarketplaceFixture.WORLD_BEHAVIOR_ROOT + "/manifest.json"]: ModelFixture.behaviorManifest(),
            [MarketplaceFixture.WORLD_RESOURCE_ROOT + "/manifest.json"]: ModelFixture.resourceManifest(),
        };
    }

    static skinPack(): FixtureFiles {
        return {
            [MarketplaceFixture.SKIN_ROOT + "/manifest.json"]: ModelFixture.skinManifest(),
            [MarketplaceFixture.SKIN_ROOT + "/skins.json"]: { skins: [] },
        };
    }

    static personaPack(id: string, pieceType: string): FixtureFiles {
        return {
            [MarketplaceFixture.PERSONA_ROOT + "/manifest.json"]: ModelFixture.personaManifest(),
            [MarketplaceFixture.PERSONA_ROOT + "/" + id + ".meta.json"]: { piece_name: id, piece_type: pieceType },
        };
    }

    static marketingImage(dpi: number | undefined = 300): Uint8Array {
        return ImageBytes.jpeg({ width: 1920, height: 1080, dpi });
    }

    static storeImage(width: number, height: number, dpi: number | undefined = 72): Uint8Array {
        return ImageBytes.jpeg({ width, height, dpi });
    }

    static marketingArt(): FixtureFiles {
        const files: Record<string, Uint8Array> = {
            [MarketplaceFixture.KEY_ART]: MarketplaceFixture.marketingImage(),
            [MarketplaceFixture.PARTNER_ART]: MarketplaceFixture.marketingImage(),
        };

        for (let index = 0; index < MarketplaceFixture.SCREENSHOT_COUNT; index += 1) {
            files[MarketplaceFixture.marketingScreenshot(index)] = MarketplaceFixture.marketingImage();
        }

        return files;
    }

    static storeArt(): FixtureFiles {
        const files: Record<string, Uint8Array> = {
            [MarketplaceFixture.THUMBNAIL]: MarketplaceFixture.storeImage(800, 450),
            [MarketplaceFixture.PANORAMA]: MarketplaceFixture.storeImage(2000, 450),
            [MarketplaceFixture.PACK_ICON]: MarketplaceFixture.storeImage(256, 256),
        };

        for (let index = 0; index < MarketplaceFixture.SCREENSHOT_COUNT; index += 1) {
            files[MarketplaceFixture.storeScreenshot(index)] = MarketplaceFixture.storeImage(800, 450);
        }

        return files;
    }

    static marketingScreenshot(index: number): string {
        return MarketplaceFixture.MARKETING_FOLDER + "/" + MarketplaceFixture.NAME + "_MarketingScreenshot_" + index + ".jpg";
    }

    static storeScreenshot(index: number): string {
        return MarketplaceFixture.STORE_FOLDER + "/" + MarketplaceFixture.LOWER_NAME + "_screenshot_" + index + ".jpg";
    }

    static personaArt(): FixtureFiles {
        const id = MarketplaceFixture.PIECE_ID;

        return {
            [MarketplaceFixture.APPROVAL_SHEET]: ImageBytes.png({ width: 5120, height: 1600 }),
            [MarketplaceFixture.marketingPath(id + "_Walking.gif")]: MarketplaceFixture.PREVIEW_GIF,
            [MarketplaceFixture.marketingPath(id + "_Running.gif")]: MarketplaceFixture.PREVIEW_GIF,
            [MarketplaceFixture.marketingPath(id + "_Swimming.gif")]: MarketplaceFixture.PREVIEW_GIF,
            [MarketplaceFixture.marketingPath(id + "_Crouching.gif")]: MarketplaceFixture.PREVIEW_GIF,
            [MarketplaceFixture.marketingPath(id + "_SideLoad.mcpack")]: MarketplaceFixture.SIDELOAD_PACK,
            [MarketplaceFixture.marketingPath(id + ArtLimits.BLOCKBENCH_PROJECT_SUFFIX + ".bbmodel")]: "{}",
            [MarketplaceFixture.PERSONA_THUMBNAIL]: ImageBytes.png({ width: 256, height: 256, alpha: true }),
        };
    }

    static emoteArt(): FixtureFiles {
        const id = MarketplaceFixture.EMOTE_ID;

        return {
            [MarketplaceFixture.EMOTE_GIF]: MarketplaceFixture.PREVIEW_GIF,
            [MarketplaceFixture.marketingPath(id + "_SideLoad.mcpack")]: MarketplaceFixture.SIDELOAD_PACK,
            [MarketplaceFixture.marketingPath(id + ArtLimits.BLOCKBENCH_PROJECT_SUFFIX + ".bbmodel")]: "{}",
            [MarketplaceFixture.storePath(id + "_thumbnail_0.png")]: ImageBytes.png({ width: 256, height: 256, alpha: true }),
        };
    }

    static addonSubmission(): FixtureFiles {
        return { ...MarketplaceFixture.addonPacks(), ...MarketplaceFixture.marketingArt(), ...MarketplaceFixture.storeArt() };
    }

    static worldSubmission(): FixtureFiles {
        return { ...MarketplaceFixture.worldFiles(), ...MarketplaceFixture.marketingArt(), ...MarketplaceFixture.storeArt() };
    }

    static skinSubmission(): FixtureFiles {
        return {
            ...MarketplaceFixture.skinPack(),
            [MarketplaceFixture.KEY_ART]: MarketplaceFixture.marketingImage(),
            [MarketplaceFixture.PARTNER_ART]: MarketplaceFixture.marketingImage(),
            [MarketplaceFixture.THUMBNAIL]: MarketplaceFixture.storeImage(800, 450),
        };
    }

    static personaSubmission(): FixtureFiles {
        return {
            ...MarketplaceFixture.personaPack(MarketplaceFixture.PIECE_ID, "persona_top"),
            ...MarketplaceFixture.personaArt(),
        };
    }

    static emoteSubmission(): FixtureFiles {
        return {
            ...MarketplaceFixture.personaPack(MarketplaceFixture.EMOTE_ID, "persona_emote"),
            ...MarketplaceFixture.emoteArt(),
        };
    }

    static without(files: FixtureFiles, ...paths: readonly string[]): FixtureFiles {
        const copy: Record<string, FixtureFiles[string]> = { ...files };

        for (const path of paths) {
            delete copy[path];
        }

        return copy;
    }

    static withoutFolder(files: FixtureFiles, folder: string): FixtureFiles {
        return Object.fromEntries(Object.entries(files).filter(([path]) => !path.startsWith(folder + "/")));
    }

    static rename(files: FixtureFiles, from: string, to: string): FixtureFiles {
        const copy: Record<string, FixtureFiles[string]> = { ...files };

        copy[to] = copy[from];
        delete copy[from];

        return copy;
    }

    static renameFolder(files: FixtureFiles, from: string, to: string): FixtureFiles {
        return Object.fromEntries(
            Object.entries(files).map(([path, content]) => [path.startsWith(from + "/") ? to + path.slice(from.length) : path, content])
        );
    }

    static withResourceHeader(headerOverrides: Record<string, unknown>): FixtureFiles {
        return {
            ...MarketplaceFixture.addonSubmission(),
            [MarketplaceFixture.RESOURCE_MANIFEST]: ModelFixture.withHeader(MarketplaceFixture.resourceManifest(), headerOverrides),
        };
    }

    static async run(check: Check, entry: MarketplaceCase): Promise<FindingSummary> {
        const findings = await MarketplaceFixture.runCheck(check, entry.files, entry.contentType ?? "addon");

        return { ids: ModelFixture.sortedIds(findings), fields: ModelFixture.fields(findings), paths: ModelFixture.paths(findings) };
    }

    static runCheck(check: Check, files: FixtureFiles, contentType: ContentType): Promise<Finding[]> {
        return ModelFixture.findings(check, files, { layout: "marketplace", contentType });
    }
}
