export interface UnknownJsonReportsUnclassifiedJsonFileCase {
    readonly name: string;
    readonly packPath: string;
    readonly expectFinding: boolean;
    readonly packType?: "behavior" | "resource";
}
