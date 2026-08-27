import type { VanillaData } from "../../src/Types/LoaderTypes.js";
import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { VanillaCopyReportsMatchingHashCase } from "../Types/VanillaCopyReportsMatchingHashTypes.js";
import crypto from "node:crypto";
import VanillaCopy from "../../src/Checks/Pack/VanillaCopy.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class VanillaCopyReportsMatchingHash {
    static readonly ID = "PACK/603";
    static readonly VANILLA_TEXTURE_BYTES = "vanilla stone";
    static readonly VANILLA_HUD_PROPERTY = { type: "panel", size: [1, 2] };
    static readonly TERRAIN_TEXTURE_HEADER = {
        resource_pack_name: "vanilla",
        texture_name: "atlas.terrain",
        padding: 8,
        num_mip_levels: 4,
    };
    static readonly CASES: readonly VanillaCopyReportsMatchingHashCase[] = [
        {
            name: "custom texture bytes and changed hud_panel match no vanilla hash",
            textureBytes: "custom stone",
            uiHudProperty: 2,
            expectedIds: [],
            expectedPaths: [],
            expectedFields: [],
        },
        {
            name: "stone.png bytes and hud_panel property match the vanilla hashes",
            textureBytes: VanillaCopyReportsMatchingHash.VANILLA_TEXTURE_BYTES,
            uiHudProperty: 1,
            expectedIds: ["PACK/603", "PACK/603"],
            expectedPaths: ["RP/textures/blocks/stone.png", "RP/ui/hud_screen.json"],
            expectedFields: ["", "hud_panel"],
        },
        {
            name: "stone.png copied into a subpack matches the vanilla hash of the path the subpack provides",
            textureBytes: "custom stone",
            uiHudProperty: 2,
            subpackTextureBytes: VanillaCopyReportsMatchingHash.VANILLA_TEXTURE_BYTES,
            expectedIds: ["PACK/603"],
            expectedPaths: ["RP/subpacks/tier2/textures/blocks/stone.png"],
            expectedFields: [""],
        },
    ];

    static excludedContentTypes(): readonly string[] {
        return new VanillaCopy().definition.excludedContentTypes ?? [];
    }

    static run(entry: VanillaCopyReportsMatchingHashCase): Promise<FindingSummary> {
        const languages = ["en_US"];
        const files: FixtureFiles = {
            "RP/manifest.json": ModelFixture.resourceManifest(),
            "RP/textures/blocks/stone.png": entry.textureBytes,
            ...VanillaCopyReportsMatchingHash.subpackFiles(entry.subpackTextureBytes),
            "RP/texts/languages.json": JSON.stringify(languages),
            "RP/textures/terrain_texture.json": {
                ...VanillaCopyReportsMatchingHash.TERRAIN_TEXTURE_HEADER,
                texture_data: { custom_stone: { textures: "textures/blocks/custom_stone" } },
            },
            "RP/ui/hud_screen.json": {
                namespace: "hud",
                hud_panel: { type: "panel", size: [entry.uiHudProperty, 2] },
                other_panel: { type: "label" },
            },
        };
        const vanilla: VanillaData = {
            files: {
                "textures/blocks/stone.png": VanillaCopyReportsMatchingHash.hash(VanillaCopyReportsMatchingHash.VANILLA_TEXTURE_BYTES),
                "texts/languages.json": VanillaCopyReportsMatchingHash.hash(JSON.stringify(languages)),
                "ui/hud_screen.json": VanillaCopyReportsMatchingHash.hash("vanilla hud screen bytes"),
            },
            properties: {
                "textures/terrain_texture.json": {
                    ...VanillaCopyReportsMatchingHash.hashEntries(VanillaCopyReportsMatchingHash.TERRAIN_TEXTURE_HEADER),
                    texture_data: VanillaCopyReportsMatchingHash.hash(JSON.stringify({ stone: { textures: "textures/blocks/stone" } })),
                },
                "ui/hud_screen.json": {
                    namespace: VanillaCopyReportsMatchingHash.hash(JSON.stringify("hud")),
                    hud_panel: VanillaCopyReportsMatchingHash.hash(JSON.stringify(VanillaCopyReportsMatchingHash.VANILLA_HUD_PROPERTY)),
                    other_panel: VanillaCopyReportsMatchingHash.hash(JSON.stringify({ type: "image" })),
                },
            },
        };
        return ModelFixture.summary(new VanillaCopy(), files, { vanilla });
    }

    private static subpackFiles(textureBytes: string | undefined): FixtureFiles {
        if (textureBytes === undefined) {
            return {};
        }

        return { "RP/subpacks/tier2/textures/blocks/stone.png": textureBytes };
    }

    private static hashEntries(value: Readonly<Record<string, unknown>>): Record<string, string> {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [key, VanillaCopyReportsMatchingHash.hash(JSON.stringify(entry))])
        );
    }

    private static hash(data: string): string {
        return crypto.createHash(VanillaCopy.HASH_ALGORITHM).update(data).digest("hex");
    }
}
