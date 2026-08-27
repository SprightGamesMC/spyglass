export default abstract class VanillaEnginePaths {
    private static readonly FOLDERS: readonly string[] = ["textures/environment/overworld_cubemap/"];

    static isEnginePath(packRelativePath: string): boolean {
        const lower = packRelativePath.toLowerCase();

        return VanillaEnginePaths.FOLDERS.some((folder) => lower.startsWith(folder));
    }
}
