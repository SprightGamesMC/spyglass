import type { GameVersion, VanillaData } from "../Types/LoaderTypes.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ToolError from "../Errors/ToolError.js";
import PathUtilities from "../Storage/PathUtilities.js";
import ImageMetadataReader from "./ImageMetadataReader.js";
import TextureFormat from "./TextureFormat.js";
import VersionUtilities from "./VersionUtilities.js";

export default class VanillaLoader {
    private static readonly DATA_FILE_NAME = "VanillaHashes.json";

    private data: VanillaData | undefined;
    private pathSet: Set<string> | undefined;
    private texturePathSet: Set<string> | undefined;
    private soundEventSet: Set<string> | undefined;
    private soundPathSet: Set<string> | undefined;
    private definitionIdSets: Map<string, Set<string>> | undefined;

    static sourceGameVersion(): string {
        const tag = VanillaLoader.readDataFile().source?.tag;
        const version = tag === undefined ? undefined : VersionUtilities.parseString(tag);

        if (version === undefined) {
            throw new ToolError("Vanilla data file has no release tag in its source field");
        }

        return VersionUtilities.format(version);
    }

    private static readDataFile(): VanillaData {
        const folder = path.dirname(fileURLToPath(import.meta.url));
        const file = path.join(folder, "..", "Data", VanillaLoader.DATA_FILE_NAME);

        try {
            return JSON.parse(fs.readFileSync(file, "utf-8")) as VanillaData;
        } catch (error) {
            throw new ToolError("Could not read vanilla data file " + file, error);
        }
    }

    private static isTexturePath(entry: string): boolean {
        return (
            entry.startsWith(TextureFormat.TEXTURE_FOLDER) && ImageMetadataReader.IMAGE_EXTENSIONS.includes(PathUtilities.extension(entry))
        );
    }

    constructor(data?: VanillaData) {
        this.data = data;
    }

    hasPath(packRelativePath: string): boolean {
        return this.paths().has(packRelativePath.toLowerCase());
    }

    hasTexturePath(packRelativePathWithoutExtension: string): boolean {
        return this.texturePaths().has(packRelativePathWithoutExtension.toLowerCase());
    }

    texturePaths(): ReadonlySet<string> {
        if (this.texturePathSet === undefined) {
            this.texturePathSet = new Set(
                [...this.paths()]
                    .filter((entry) => VanillaLoader.isTexturePath(entry))
                    .map((entry) => PathUtilities.withoutExtension(entry))
            );
        }

        return this.texturePathSet;
    }

    hasSoundEvent(name: string): boolean {
        if (this.soundEventSet === undefined) {
            this.soundEventSet = new Set((this.get().soundEvents ?? []).map((event) => event.toLowerCase()));
        }

        return this.soundEventSet.has(name.toLowerCase());
    }

    hasSoundPath(packRelativePathWithoutExtension: string): boolean {
        if (this.soundPathSet === undefined) {
            this.soundPathSet = new Set((this.get().soundPaths ?? []).map((entry) => entry.toLowerCase()));
        }

        return this.soundPathSet.has(packRelativePathWithoutExtension.toLowerCase());
    }

    hasDefinitionId(kind: string, id: string): boolean {
        if (this.definitionIdSets === undefined) {
            this.definitionIdSets = new Map(
                Object.entries(this.get().definitionIds ?? {}).map(([entryKind, ids]) => [entryKind, new Set(ids)])
            );
        }

        return this.definitionIdSets.get(kind)?.has(id) === true;
    }

    maxFormatVersion(kind: string): GameVersion | undefined {
        const recorded = this.get().formatVersions?.[kind];

        return recorded === undefined ? undefined : VersionUtilities.parseString(recorded);
    }

    fileHash(packRelativePath: string): string | undefined {
        return this.get().files[packRelativePath.toLowerCase()];
    }

    propertyHashes(packRelativePath: string): Readonly<Record<string, string>> | undefined {
        return this.get().properties[packRelativePath.toLowerCase()];
    }

    private get(): VanillaData {
        if (this.data === undefined) {
            this.data = VanillaLoader.readDataFile();
        }

        return this.data;
    }

    private paths(): Set<string> {
        if (this.pathSet === undefined) {
            this.pathSet = new Set(Object.keys(this.get().files));
        }

        return this.pathSet;
    }
}
