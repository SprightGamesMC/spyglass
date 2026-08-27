export interface BetaModuleCase {
    readonly name: string;
    readonly packRoot: string;
    readonly moduleName: string;
    readonly version: string;
    readonly betaModuleVersions: Readonly<Record<string, string>>;
    readonly expectFinding: boolean;
}
