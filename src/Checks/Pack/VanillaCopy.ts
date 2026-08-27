import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ContentItem, Pack } from "../../Types/ModelTypes.js";
import crypto from "node:crypto";
import SubpackFormat from "../../Loaders/SubpackFormat.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class VanillaCopy extends Check {
    static readonly HASH_ALGORITHM = "sha1";

    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.VANILLA_COPY,
        slug: "vanilla-copy",
        severity: "recommendation",
        description: "File is a full or partial copy of a vanilla file",
        excludedContentTypes: ["texture", "addon"],
    };

    private static hash(data: Uint8Array | string): string {
        return crypto.createHash(VanillaCopy.HASH_ALGORITHM).update(data).digest("hex");
    }

    private static isExempt(packPath: string): boolean {
        return PackLimits.VANILLA_COPY_EXEMPT_PATHS.includes(packPath);
    }

    private static requiresPropertyComparison(packPath: string): boolean {
        if (!PackLimits.PARTIAL_COPY_EXTENSIONS.includes(PathUtilities.extension(packPath))) {
            return false;
        }

        if (PackLimits.PARTIAL_COPY_FILE_NAMES.includes(PathUtilities.fileName(packPath))) {
            return true;
        }

        return PackLimits.PARTIAL_COPY_FOLDERS.some((folder) => packPath.startsWith(folder));
    }

    private static async readBytes(context: CheckContext, path: string): Promise<Uint8Array | undefined> {
        try {
            return await context.model.storage.readBytes(path);
        } catch {
            return undefined;
        }
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            for (const item of pack.items) {
                findings.push(...(await this.checkItem(context, pack, item)));
            }
        }

        return findings;
    }

    private async checkItem(context: CheckContext, pack: Pack, item: ContentItem): Promise<Finding[]> {
        const packPath = SubpackFormat.pathWithoutSubpack(item.packPath).toLowerCase();

        if (VanillaCopy.isExempt(packPath)) {
            return [];
        }

        const vanillaHash = context.loaders.vanilla.fileHash(packPath);

        if (vanillaHash !== undefined && (await this.isCompleteCopy(context, item, vanillaHash))) {
            return [this.finding("File is a complete copy of vanilla " + packPath, item.path, pack.root)];
        }

        if (!VanillaCopy.requiresPropertyComparison(packPath)) {
            return [];
        }

        return this.checkProperties(context, pack, item, packPath);
    }

    private async isCompleteCopy(context: CheckContext, item: ContentItem, vanillaHash: string): Promise<boolean> {
        const bytes = await VanillaCopy.readBytes(context, item.path);

        return bytes !== undefined && VanillaCopy.hash(bytes) === vanillaHash;
    }

    private async checkProperties(context: CheckContext, pack: Pack, item: ContentItem, packPath: string): Promise<Finding[]> {
        const vanillaProperties = context.loaders.vanilla.propertyHashes(packPath);

        if (vanillaProperties === undefined) {
            return [];
        }

        const value = await context.loaders.json.readObject(item.path);

        if (value === undefined) {
            return [];
        }

        const findings: Finding[] = [];

        for (const [key, entry] of Object.entries(value)) {
            if (PackLimits.PARTIAL_COPY_EXEMPT_PROPERTIES.includes(key)) {
                continue;
            }

            if (vanillaProperties[key] === undefined || VanillaCopy.hash(JSON.stringify(entry)) !== vanillaProperties[key]) {
                continue;
            }

            findings.push(
                this.finding("Property " + key + " is a copy of the same property in vanilla " + packPath, item.path, pack.root, {
                    field: key,
                })
            );
        }

        return findings;
    }
}
