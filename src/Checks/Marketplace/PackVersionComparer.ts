import type Loaders from "../../Loaders/Loaders.js";
import type { PackVersion, PackVersionDifference, PackVersionField } from "../../Types/MarketplaceTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";

export default abstract class PackVersionComparer {
    static async collect(loaders: Loaders, packs: readonly Pack[], field: PackVersionField): Promise<PackVersion[]> {
        const versions: PackVersion[] = [];

        for (const pack of packs) {
            const manifest = await ManifestLoader.read(loaders, pack);
            const version = field === "header.version" ? ManifestLoader.headerVersion(manifest) : ManifestLoader.minEngineVersion(manifest);

            if (version !== undefined) {
                versions.push({ pack, field, version });
            }
        }

        return versions;
    }

    static differences(versions: readonly PackVersion[]): PackVersionDifference[] {
        if (versions.length === 0) {
            return [];
        }

        const reference = versions[0];
        const differences: PackVersionDifference[] = [];

        for (const candidate of versions.slice(1)) {
            if (ManifestLoader.versionsEqual(candidate.version, reference.version)) {
                continue;
            }

            const message =
                candidate.field +
                " " +
                VersionUtilities.format(candidate.version) +
                " differs from " +
                VersionUtilities.format(reference.version) +
                " in " +
                reference.pack.manifestPath;

            differences.push({ pack: candidate.pack, message });
        }

        return differences;
    }
}
