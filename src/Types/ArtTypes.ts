import type { ArtFile } from "./ModelTypes.js";

export type ArtRole =
    | "key_art"
    | "partner_art"
    | "marketing_screenshot"
    | "thumbnail"
    | "store_screenshot"
    | "panorama"
    | "pack_icon"
    | "approval_sheet"
    | "walk_cycle_gif"
    | "preview_gif"
    | "sideload_pack"
    | "blockbench_project"
    | "unknown";

export interface ClassifiedArtFile {
    readonly file: ArtFile;
    readonly role: ArtRole;
    readonly prefix: string;
    readonly variant?: string;
}

export interface ArtNamePatterns {
    readonly marketing: readonly RegExp[];
    readonly store: readonly RegExp[];
}

export type ArtNameKind = "standard" | "persona" | "emote";
