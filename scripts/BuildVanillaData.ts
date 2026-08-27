import type { JsonValue, VanillaData } from "../src/Types/LoaderTypes.js";
import type { PackType } from "../src/Types/ModelTypes.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import SoundDefinitionsSchema from "../src/Data/Schemas/SoundDefinitionsSchema.js";
import GeometryReader from "../src/Loaders/GeometryReader.js";
import VersionUtilities from "../src/Loaders/VersionUtilities.js";
import ItemClassifier from "../src/Model/ItemClassifier.js";
import DefinitionLimits from "../src/Checks/Definition/DefinitionLimits.js";
import JsonKeys from "../src/Data/JsonKeys.js";
import JsoncParser from "../src/Loaders/JsoncParser.js";
import PathUtilities from "../src/Storage/PathUtilities.js";
import ZipReader from "../src/Storage/ZipReader.js";

export default abstract class BuildVanillaData {
    private static readonly RELEASE_URL = "https://api.github.com/repos/Mojang/bedrock-samples/releases/latest";
    private static readonly ARCHIVE_URL_PREFIX = "https://github.com/Mojang/bedrock-samples/archive/refs/tags/";
    private static readonly TAG_OPTION = "--tag";
    private static readonly CHECK_OPTION = "--check";
    private static readonly DATE_LENGTH = 10;
    private static readonly PACK_ROOTS: Readonly<Record<string, PackType>> = {
        "resource_pack/": "resource",
        "behavior_pack/": "behavior",
    };
    private static readonly PROPERTY_HASH_FILES: readonly string[] = [
        "mobs.json",
        "sound_definitions.json",
        "item_texture.json",
        "terrain_texture.json",
        "blocks.json",
    ];
    private static readonly PROPERTY_HASH_FOLDERS: readonly string[] = ["ui/", "materials/"];
    private static readonly SOUND_DEFINITIONS_PATH = "sounds/sound_definitions.json";
    private static readonly DEFINITION_ID_FOLDERS: Readonly<Record<string, string>> = {
        "models/": "geometry",
        "animations/": "animation",
        "animation_controllers/": "animation",
        "render_controllers/": "render_controller",
    };
    private static readonly DEFINITION_ID_CONTAINERS: readonly string[] = ["animations", "animation_controllers", "render_controllers"];

    static async main(): Promise<void> {
        const argv = process.argv.slice(2);
        const output = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "Data", "VanillaHashes.json");

        if (argv.includes(BuildVanillaData.CHECK_OPTION)) {
            process.exitCode = await BuildVanillaData.check(output);

            return;
        }

        const tag = BuildVanillaData.requestedTag(argv) ?? (await BuildVanillaData.latestTag());
        const bytes = await BuildVanillaData.download(tag);
        const reader = new ZipReader(bytes);
        const files: Record<string, string> = {};
        const properties: Record<string, Record<string, string>> = {};
        let soundEvents: string[] = [];
        let soundPaths: string[] = [];
        const definitionIdSets: Record<string, Set<string>> = {};
        const formatVersions: Record<string, string> = {};

        for (const entry of reader.entries) {
            const located = BuildVanillaData.packRelative(entry.path);

            if (located === undefined) {
                continue;
            }

            const packPath = located.path;
            const data = reader.read(entry);

            files[packPath] = BuildVanillaData.hash(data);

            if (BuildVanillaData.wantsPropertyHashes(packPath)) {
                properties[packPath] = BuildVanillaData.propertyHashes(data);
            }

            if (packPath === BuildVanillaData.SOUND_DEFINITIONS_PATH) {
                soundEvents = BuildVanillaData.soundEventNames(data);
                soundPaths = BuildVanillaData.soundFilePaths(data);
            }

            BuildVanillaData.collectDefinitionIds(packPath, data, definitionIdSets);
            BuildVanillaData.collectFormatVersion(located.packType, packPath, data, formatVersions);
        }

        const definitionIds = Object.fromEntries(Object.entries(definitionIdSets).map(([kind, ids]) => [kind, [...ids].sort()]));

        const source = { tag, date: BuildVanillaData.today() };

        fs.writeFileSync(output, JSON.stringify({ source, files, properties, soundEvents, soundPaths, definitionIds, formatVersions }));
        process.stdout.write("Wrote " + Object.keys(files).length + " vanilla file hashes from " + tag + " to " + output + "\n");
    }

    private static async check(output: string): Promise<number> {
        const recorded = BuildVanillaData.recordedTag(output);
        const latest = await BuildVanillaData.latestTag();

        process.stdout.write("Recorded " + recorded + ", newest release " + latest + "\n");

        return recorded === latest ? 0 : 1;
    }

    private static recordedTag(output: string): string | undefined {
        const parsed = JSON.parse(fs.readFileSync(output, "utf-8")) as VanillaData;

        return parsed.source?.tag;
    }

    private static requestedTag(argv: readonly string[]): string | undefined {
        const index = argv.indexOf(BuildVanillaData.TAG_OPTION);

        return index === -1 ? undefined : argv[index + 1];
    }

    private static async latestTag(): Promise<string> {
        const response = await fetch(BuildVanillaData.RELEASE_URL, { headers: { accept: "application/vnd.github+json" } });

        if (!response.ok) {
            throw new Error("Release lookup failed with HTTP " + response.status);
        }

        const body = (await response.json()) as Record<string, unknown>;

        if (typeof body.tag_name !== "string") {
            throw new Error("Release data has no tag_name");
        }

        return body.tag_name;
    }

    private static today(): string {
        return new Date().toISOString().slice(0, BuildVanillaData.DATE_LENGTH);
    }

    private static async download(tag: string): Promise<Uint8Array> {
        const url = BuildVanillaData.ARCHIVE_URL_PREFIX + tag + ".zip";

        process.stdout.write("Downloading " + url + "\n");

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Download failed with HTTP " + response.status);
        }

        return new Uint8Array(await response.arrayBuffer());
    }

    private static packRelative(archivePath: string): { path: string; packType: PackType } | undefined {
        const segments = PathUtilities.segments(archivePath);

        if (segments.length < 3) {
            return undefined;
        }

        const withoutRoot = segments.slice(1).join("/");
        const root = Object.keys(BuildVanillaData.PACK_ROOTS).find((candidate) => withoutRoot.startsWith(candidate));

        if (root === undefined) {
            return undefined;
        }

        return { path: withoutRoot.slice(root.length).toLowerCase(), packType: BuildVanillaData.PACK_ROOTS[root] };
    }

    private static wantsPropertyHashes(packPath: string): boolean {
        const name = PathUtilities.fileName(packPath);
        const extension = PathUtilities.extension(packPath);

        if (extension !== "json" && extension !== "material") {
            return false;
        }

        if (BuildVanillaData.PROPERTY_HASH_FILES.includes(name)) {
            return true;
        }

        return BuildVanillaData.PROPERTY_HASH_FOLDERS.some((folder) => packPath.startsWith(folder));
    }

    private static propertyHashes(data: Uint8Array): Record<string, string> {
        const hashes: Record<string, string> = {};
        const parsed = BuildVanillaData.parseObject(data);

        if (parsed === undefined) {
            return hashes;
        }

        for (const [key, value] of Object.entries(parsed)) {
            hashes[key] = BuildVanillaData.hash(new TextEncoder().encode(JSON.stringify(value)));
        }

        return hashes;
    }

    private static soundEventNames(data: Uint8Array): string[] {
        return Object.keys(BuildVanillaData.soundDefinitions(data)).sort();
    }

    private static soundDefinitions(data: Uint8Array): Record<string, unknown> {
        const parsed = BuildVanillaData.parseObject(data);
        const definitions = parsed?.[SoundDefinitionsSchema.DEFINITIONS_KEY];

        if (typeof definitions !== "object" || definitions === null || Array.isArray(definitions)) {
            return {};
        }

        return definitions as Record<string, unknown>;
    }

    private static soundFilePaths(data: Uint8Array): string[] {
        const definitions = BuildVanillaData.soundDefinitions(data);
        const paths = new Set<string>();

        for (const definition of Object.values(definitions)) {
            for (const entry of BuildVanillaData.soundEntries(definition)) {
                paths.add(entry.toLowerCase());
            }
        }

        return [...paths].sort();
    }

    private static soundEntries(definition: unknown): string[] {
        const sounds = (definition as Record<string, unknown> | null)?.sounds;

        if (!Array.isArray(sounds)) {
            return [];
        }

        const names: string[] = [];

        for (const entry of sounds) {
            const name = typeof entry === "string" ? entry : (entry as Record<string, unknown> | null)?.name;

            if (typeof name === "string") {
                names.push(name);
            }
        }

        return names;
    }

    private static collectFormatVersion(packType: PackType, packPath: string, data: Uint8Array, output: Record<string, string>): void {
        if (PathUtilities.extension(packPath) !== "json") {
            return;
        }

        const parsed = BuildVanillaData.parseObject(data);
        const version = parsed === undefined ? undefined : VersionUtilities.parse(parsed[JsonKeys.FORMAT_VERSION] as JsonValue);

        if (version === undefined) {
            return;
        }

        const kind = ItemClassifier.classify(packType, packPath);

        if (!DefinitionLimits.VANILLA_KINDS.includes(kind)) {
            return;
        }

        const recorded = output[kind];
        const previous = recorded === undefined ? undefined : VersionUtilities.parseString(recorded);

        if (previous !== undefined && VersionUtilities.compare(version, previous) <= 0) {
            return;
        }

        output[kind] = VersionUtilities.format(version);
    }

    private static collectDefinitionIds(packPath: string, data: Uint8Array, output: Record<string, Set<string>>): void {
        const folder = Object.keys(BuildVanillaData.DEFINITION_ID_FOLDERS).find((candidate) => packPath.startsWith(candidate));

        if (folder === undefined || PathUtilities.extension(packPath) !== "json") {
            return;
        }

        const kind = BuildVanillaData.DEFINITION_ID_FOLDERS[folder];
        const parsed = BuildVanillaData.parseObject(data);

        if (parsed === undefined) {
            return;
        }

        const ids = output[kind] ?? new Set<string>();

        output[kind] = ids;

        for (const id of BuildVanillaData.definitionIdsIn(parsed)) {
            ids.add(id);
        }
    }

    private static definitionIdsIn(parsed: Record<string, unknown>): string[] {
        const ids: string[] = [];

        for (const [key, value] of Object.entries(parsed)) {
            if (key.startsWith(GeometryReader.LEGACY_KEY_PREFIX)) {
                ids.push(key.split(":")[0]);
                continue;
            }

            if (BuildVanillaData.DEFINITION_ID_CONTAINERS.includes(key) && typeof value === "object" && value !== null) {
                ids.push(...Object.keys(value));
                continue;
            }

            if (key === GeometryReader.GEOMETRY_KEY && Array.isArray(value)) {
                ids.push(...BuildVanillaData.geometryIdentifiers(value));
            }
        }

        return ids;
    }

    private static geometryIdentifiers(entries: unknown[]): string[] {
        const ids: string[] = [];

        for (const entry of entries) {
            const description = typeof entry === "object" && entry !== null ? (entry as Record<string, unknown>).description : undefined;
            const identifier =
                typeof description === "object" && description !== null ? (description as Record<string, unknown>).identifier : undefined;

            if (typeof identifier === "string") {
                ids.push(identifier.split(":")[0]);
            }
        }

        return ids;
    }

    private static parseObject(data: Uint8Array): Record<string, unknown> | undefined {
        try {
            const parsed = JsoncParser.parse(new TextDecoder("utf-8").decode(data));

            if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
                return undefined;
            }

            return parsed as Record<string, unknown>;
        } catch {
            return undefined;
        }
    }

    private static hash(data: Uint8Array): string {
        return crypto.createHash("sha1").update(data).digest("hex");
    }
}

await BuildVanillaData.main();
