export interface DocumentedCheck {
    readonly id: string;
    readonly slug: string;
    readonly severity: string;
    readonly description: string;
}

export interface RegistryDifference {
    readonly id: string;
    readonly problem: string;
}
