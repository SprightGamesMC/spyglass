export interface TooManyTextureHandlesReportsOverLimitCase {
    readonly name: string;
    readonly handleCount: number;
    readonly expectedIds: readonly string[];
}
