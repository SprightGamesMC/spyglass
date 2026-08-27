import type { ArtNameKind, ArtRole, ClassifiedArtFile } from "../../Types/ArtTypes.js";
import type { PersonaPieceIdentity } from "../../Types/PersonaTypes.js";
import type { ArtFile, ArtFolder, ContentModel } from "../../Types/ModelTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import PersonaLimits from "../Persona/PersonaLimits.js";
import ArtLimits from "./ArtLimits.js";

export default abstract class ArtFileRoles {
    static classifyAll(model: ContentModel): ClassifiedArtFile[] {
        return model.art.map((file) => ArtFileRoles.classify(file));
    }

    static withRole(model: ContentModel, role: ArtRole): ClassifiedArtFile[] {
        return ArtFileRoles.classifyAll(model).filter((entry) => entry.role === role);
    }

    static hasFolder(model: ContentModel, folder: ArtFolder): boolean {
        return model.art.some((file) => file.folder === folder);
    }

    static nameKind(identity: PersonaPieceIdentity | undefined): ArtNameKind {
        if (identity === undefined) {
            return "standard";
        }

        return identity.pieceType === PersonaLimits.EMOTE_TYPE ? "emote" : "persona";
    }

    private static classify(file: ArtFile): ClassifiedArtFile {
        const nameWithoutExtension = PathUtilities.nameWithoutExtension(file.name);

        if (file.folder === ArtLimits.STORE_FOLDER) {
            return ArtFileRoles.classifyStore(file, nameWithoutExtension);
        }

        return ArtFileRoles.classifyMarketing(file, nameWithoutExtension);
    }

    private static classifyStore(file: ArtFile, nameWithoutExtension: string): ClassifiedArtFile {
        const containing: [string, ArtRole][] = [
            [ArtLimits.THUMBNAIL_SUFFIX, "thumbnail"],
            [ArtLimits.STORE_SCREENSHOT_SUFFIX, "store_screenshot"],
            [ArtLimits.PANORAMA_SUFFIX, "panorama"],
            [ArtLimits.PACK_ICON_SUFFIX, "pack_icon"],
        ];

        for (const [suffix, role] of containing) {
            const prefix = ArtFileRoles.prefixBefore(nameWithoutExtension, suffix);

            if (prefix !== undefined) {
                return { file, role, prefix };
            }
        }

        return { file, role: "unknown", prefix: nameWithoutExtension };
    }

    private static classifyMarketing(file: ArtFile, nameWithoutExtension: string): ClassifiedArtFile {
        const screenshotPrefix = ArtFileRoles.prefixBefore(nameWithoutExtension, ArtLimits.MARKETING_SCREENSHOT_SUFFIX);

        if (screenshotPrefix !== undefined) {
            return { file, role: "marketing_screenshot", prefix: screenshotPrefix };
        }

        const ending: [string, ArtRole][] = [
            [ArtLimits.KEY_ART_SUFFIX, "key_art"],
            [ArtLimits.PARTNER_ART_SUFFIX, "partner_art"],
            [ArtLimits.APPROVAL_SHEET_SUFFIX, "approval_sheet"],
            [ArtLimits.SIDELOAD_SUFFIX, "sideload_pack"],
            [ArtLimits.BLOCKBENCH_PROJECT_SUFFIX, "blockbench_project"],
        ];

        for (const [suffix, role] of ending) {
            const prefix = ArtFileRoles.prefixBeforeEnding(nameWithoutExtension, suffix);

            if (prefix !== undefined) {
                return { file, role, prefix };
            }
        }

        for (const variant of ArtLimits.WALK_CYCLE_VARIANTS) {
            const prefix = ArtFileRoles.prefixBeforeEnding(nameWithoutExtension, "_" + variant);

            if (prefix !== undefined) {
                return { file, role: "walk_cycle_gif", prefix, variant };
            }
        }

        if (PathUtilities.extension(file.name) === ArtLimits.GIF_EXTENSION) {
            return { file, role: "preview_gif", prefix: nameWithoutExtension };
        }

        return { file, role: "unknown", prefix: nameWithoutExtension };
    }

    private static prefixBefore(nameWithoutExtension: string, suffix: string): string | undefined {
        const index = nameWithoutExtension.toLowerCase().indexOf(suffix.toLowerCase());

        return index <= 0 ? undefined : nameWithoutExtension.slice(0, index);
    }

    private static prefixBeforeEnding(nameWithoutExtension: string, suffix: string): string | undefined {
        const lower = nameWithoutExtension.toLowerCase();

        if (!lower.endsWith(suffix.toLowerCase()) || lower.length === suffix.length) {
            return undefined;
        }

        return nameWithoutExtension.slice(0, nameWithoutExtension.length - suffix.length);
    }
}
