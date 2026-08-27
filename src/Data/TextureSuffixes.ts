export default abstract class TextureSuffixes {
    static readonly COMPANION: readonly string[] = ["_mer", "_mers", "_normal", "_heightmap"];
    static readonly MER: readonly string[] = ["_mer", "_mers"];

    static hasSuffix(key: string, suffixes: readonly string[]): boolean {
        return suffixes.some((suffix) => key.endsWith(suffix));
    }
}
