import type { CheckDefinition } from "../../src/Types/CheckTypes.js";

export interface ResolverFixture {
    readonly definitions: readonly CheckDefinition[];
}
