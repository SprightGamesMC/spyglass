import TextureSuffixes from "./TextureSuffixes.js";

export default abstract class VanillaTextureExemptions {
    private static readonly FOLDERS: readonly string[] = [
        "textures/entity/npc/",
        "textures/entity/banner/",
        "textures/entity/horse/",
        "textures/entity/horse/armor/",
        "textures/entity/zombie_villager/",
        "textures/entity/villager/",
        "textures/entity/zombie_villager2/professions/",
        "textures/colormap/",
        "textures/particle/",
        "textures/misc/",
        "textures/persona_thumbnails/",
        "textures/ui/",
        "textures/gui/",
        "textures/entity/shield_patterns/",
        "textures/trims/",
        "textures/map/",
        "textures/models/",
    ];
    private static readonly FILES: readonly string[] = [
        "textures/blocks/glowing_obsidian",
        "textures/blocks/missing_tile",
        "textures/blocks/camera_back",
        "textures/blocks/camera_front",
        "textures/blocks/camera_side",
        "textures/blocks/camera_top",
        "textures/blocks/reactor_core_stage_0",
        "textures/blocks/reactor_core_stage_1",
        "textures/blocks/reactor_core_stage_2",
        "textures/blocks/bed_feet_end",
        "textures/blocks/bed_feet_side",
        "textures/blocks/bed_feet_top",
        "textures/blocks/bed_head_end",
        "textures/blocks/bed_head_side",
        "textures/blocks/bed_head_top",
        "textures/blocks/flower_rose_blue",
        "textures/blocks/flower_paeonia",
        "textures/blocks/llama",
        "textures/blocks/border",
        "textures/blocks/build_allow",
        "textures/blocks/build_deny",
        "textures/blocks/smithing_table_top",
        "textures/blocks/end_gateway",
        "textures/blocks/end_portal",
        "textures/blocks/water_flow",
        "textures/blocks/water_still",
        "textures/blocks/carrots_stage3",
        "textures/blocks/bell_side",
        "textures/blocks/bell_top",
        "textures/entity/agent",
        "textures/entity/alex",
        "textures/entity/camera_tripod",
        "textures/entity/char",
        "textures/entity/dummy",
        "textures/entity/screenshot_frame",
        "textures/entity/enchanting_table_book_shadow",
        "textures/entity/loyalty_rope",
        "textures/entity/egg_null",
        "textures/entity/egg_template",
        "textures/entity/dragon_exploding",
        "textures/entity/dragon_eyes",
        "textures/entity/llama",
        "textures/entity/pigzombie",
        "textures/entity/steve",
        "textures/entity/cape_invisible",
        "textures/entity/cat/blackcat",
        "textures/entity/cat/graytabby_tame",
        "textures/entity/cat/red",
        "textures/entity/cat/siamese",
        "textures/entity/fish/clownfish",
        "textures/entity/fish/fish",
        "textures/entity/villager2/professions/unskilled",
        "textures/entity/horse2/horse_markings_none",
        "textures/entity/horse2/armor/horse_armor_none",
        "textures/entity/llama/decor/decor_none",
        "textures/entity/llama/spit",
        "textures/entity/iron_golem/cracked_none",
        "textures/entity/wolf/wolf_armor_cracked_none",
        "textures/items/camera",
        "textures/items/chalkboard_large",
        "textures/items/chalkboard_medium",
        "textures/items/chalkboard_small",
        "textures/items/egg_agent",
        "textures/items/egg_npc",
        "textures/items/quiver",
        "textures/items/ruby",
        "textures/items/spawn_egg_overlay",
        "textures/items/book_portfolio",
        "textures/items/boat",
        "textures/items/tipped_arrow_base",
        "textures/items/tipped_arrow_head",
        "textures/items/tipped_arrow_luck",
        "textures/items/potion_bottle_saturation",
        "textures/items/potion_overlay",
        "textures/items/egg_template",
        "textures/items/egg_mask",
        "textures/items/spawn_egg",
        "textures/items/hoglin_meat_cooked",
        "textures/items/hoglin_meat_raw",
        "textures/items/egg_fish",
        "textures/items/boat_dark_oak",
        "textures/items/light_block_0",
        "textures/items/light_block_1",
        "textures/items/light_block_2",
        "textures/items/light_block_3",
        "textures/items/light_block_4",
        "textures/items/light_block_5",
        "textures/items/light_block_6",
        "textures/items/light_block_7",
        "textures/items/light_block_8",
        "textures/items/light_block_9",
        "textures/items/light_block_10",
        "textures/items/light_block_11",
        "textures/items/light_block_12",
        "textures/items/light_block_13",
        "textures/items/light_block_14",
        "textures/items/light_block_15",
        "textures/forcefield_atlas",
    ];
    private static readonly MIPMAP_SUFFIX_PATTERN = /_mipmap_?\d*$/;
    private static readonly COVERAGE_FOLDERS: readonly string[] = ["textures/blocks/", "textures/entity/", "textures/items/"];

    static countsForCoverage(packRelativePathWithoutExtension: string): boolean {
        const lower = packRelativePathWithoutExtension.toLowerCase();

        if (!VanillaTextureExemptions.COVERAGE_FOLDERS.some((folder) => lower.startsWith(folder))) {
            return false;
        }

        if (TextureSuffixes.hasSuffix(lower, TextureSuffixes.COMPANION) || VanillaTextureExemptions.MIPMAP_SUFFIX_PATTERN.test(lower)) {
            return false;
        }

        return !VanillaTextureExemptions.isExempt(lower);
    }

    private static isExempt(packRelativePathWithoutExtension: string): boolean {
        const lower = packRelativePathWithoutExtension.toLowerCase();

        if (VanillaTextureExemptions.FOLDERS.some((folder) => lower.startsWith(folder))) {
            return true;
        }

        return VanillaTextureExemptions.FILES.includes(lower);
    }
}
