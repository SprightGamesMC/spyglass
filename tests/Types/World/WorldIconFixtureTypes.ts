interface IconFixture {
    readonly name: string;
    readonly width?: number;
    readonly height?: number;
}

export interface WorldIconCase {
    readonly name: string;
    readonly icons: readonly IconFixture[];
    readonly education?: boolean;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}
