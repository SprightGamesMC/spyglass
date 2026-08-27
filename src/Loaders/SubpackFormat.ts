import PathUtilities from "../Storage/PathUtilities.js";

export default abstract class SubpackFormat {
    static readonly FOLDER = "subpacks";

    static folderName(packPath: string): string | undefined {
        const segments = PathUtilities.segments(packPath);

        if (segments.length < 3 || segments[0].toLowerCase() !== SubpackFormat.FOLDER) {
            return undefined;
        }

        return segments[1];
    }

    static pathWithoutSubpack(packPath: string): string {
        if (SubpackFormat.folderName(packPath) === undefined) {
            return PathUtilities.normalize(packPath);
        }

        return PathUtilities.segments(packPath).slice(2).join("/");
    }
}
