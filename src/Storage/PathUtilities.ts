export default abstract class PathUtilities {
    static readonly ASSET_EXTENSIONS: readonly string[] = ["png", "tga", "jpg", "jpeg", "ogg", "wav", "fsb", "mp3"];

    static normalize(path: string): string {
        const forward = path.replaceAll("\\", "/");
        const segments = forward.split("/").filter((segment) => segment !== "" && segment !== ".");

        return segments.join("/");
    }

    static join(...parts: string[]): string {
        return PathUtilities.normalize(parts.filter((part) => part !== "").join("/"));
    }

    static fileName(path: string): string {
        const normalized = PathUtilities.normalize(path);
        const index = normalized.lastIndexOf("/");

        return index < 0 ? normalized : normalized.slice(index + 1);
    }

    static directory(path: string): string {
        const normalized = PathUtilities.normalize(path);
        const index = normalized.lastIndexOf("/");

        return index < 0 ? "" : normalized.slice(0, index);
    }

    static extension(path: string): string {
        const name = PathUtilities.fileName(path);
        const index = name.lastIndexOf(".");

        return index <= 0 ? "" : name.slice(index + 1).toLowerCase();
    }

    static nameWithoutExtension(path: string): string {
        const name = PathUtilities.fileName(path);
        const index = name.lastIndexOf(".");

        return index <= 0 ? name : name.slice(0, index);
    }

    static withoutExtension(path: string): string {
        const normalized = PathUtilities.normalize(path);
        const name = PathUtilities.fileName(normalized);
        const index = name.lastIndexOf(".");

        if (index <= 0) {
            return normalized;
        }

        return normalized.slice(0, normalized.length - (name.length - index));
    }

    static segments(path: string): string[] {
        const normalized = PathUtilities.normalize(path);

        return normalized === "" ? [] : normalized.split("/");
    }

    static isInside(path: string, root: string): boolean {
        if (root === "") {
            return true;
        }

        return path === root || path.startsWith(root + "/");
    }

    static relativeTo(path: string, root: string): string {
        if (root === "") {
            return path;
        }

        if (path === root) {
            return "";
        }

        return path.startsWith(root + "/") ? path.slice(root.length + 1) : path;
    }

    static normalizeReference(reference: string): string | undefined {
        const normalized = PathUtilities.normalize(reference).toLowerCase();

        if (normalized === "") {
            return undefined;
        }

        if (!PathUtilities.ASSET_EXTENSIONS.includes(PathUtilities.extension(normalized))) {
            return normalized;
        }

        return PathUtilities.withoutExtension(normalized);
    }

    static firstSegment(path: string): string {
        const segments = PathUtilities.segments(path);

        return segments.length === 0 ? "" : segments[0];
    }
}
