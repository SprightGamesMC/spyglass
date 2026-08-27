import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ResourcePackScopeMissingReportsAbsentScopeCase } from "../Types/ResourcePackScopeMissingReportsAbsentScopeTypes.js";
import ResourcePackScopeMissing from "../../src/Checks/Addon/ResourcePackScopeMissing.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class ResourcePackScopeMissingReportsAbsentScope {
    static readonly ID = "ADDON/209";
    static readonly PATH = AddonFixture.RP + "manifest.json";
    static readonly CASES: readonly ResourcePackScopeMissingReportsAbsentScopeCase[] = [
        { name: "pack_scope world is the expected scope", packScope: "world", expectedIds: [], expectedPaths: [] },
        {
            name: "resource manifest without pack_scope has no scope",
            expectedIds: ["ADDON/209"],
            expectedPaths: [ResourcePackScopeMissingReportsAbsentScope.PATH],
        },
        {
            name: "pack_scope global is not world",
            packScope: "global",
            expectedIds: ["ADDON/209"],
            expectedPaths: [ResourcePackScopeMissingReportsAbsentScope.PATH],
        },
    ];

    static async run(entry: ResourcePackScopeMissingReportsAbsentScopeCase): Promise<FindingSummary> {
        const extra = entry.packScope === undefined ? {} : { pack_scope: entry.packScope };

        return AddonFixture.run(new ResourcePackScopeMissing(), {
            [ResourcePackScopeMissingReportsAbsentScope.PATH]: ModelFixture.withHeader(ModelFixture.resourceManifest(), extra),
        });
    }
}
