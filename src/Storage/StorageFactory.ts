import type { Storage } from "../Types/StorageTypes.js";
import fs from "node:fs";
import ToolError from "../Errors/ToolError.js";
import UsageError from "../Errors/UsageError.js";
import FileSystemStorage from "./FileSystemStorage.js";
import ZipStorage from "./ZipStorage.js";

export default abstract class StorageFactory {
    static async open(inputPath: string): Promise<Storage> {
        if (!fs.existsSync(inputPath)) {
            throw new UsageError("Input path does not exist: " + inputPath);
        }

        const stats = fs.statSync(inputPath);

        if (stats.isDirectory()) {
            return new FileSystemStorage(inputPath);
        }

        if (!ZipStorage.isArchivePath(inputPath)) {
            throw new UsageError("Input must be a folder or an archive: " + inputPath);
        }

        return StorageFactory.openArchive(inputPath);
    }

    private static async openArchive(inputPath: string): Promise<Storage> {
        let bytes: Uint8Array;

        try {
            const buffer = await fs.promises.readFile(inputPath);

            bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        } catch (error) {
            throw new ToolError("Could not read archive " + inputPath, error);
        }

        try {
            return new ZipStorage(bytes);
        } catch (error) {
            throw new ToolError("Could not open archive " + inputPath + ": " + ToolError.describe(error), error);
        }
    }
}
