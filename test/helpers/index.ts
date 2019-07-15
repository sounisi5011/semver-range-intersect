import equal from 'fast-deep-equal';
import semver from 'semver';

export function semverDecrement(
    v: string | semver.SemVer,
    release: semver.ReleaseType,
): string | null {
    const maxVerUnit = 9999;
    const minPrerelease = [0];
    const maxPrerelease = ['zzzzzzzzzz'];
    try {
        const semVer = new semver.SemVer(String(v));
        switch (release) {
            case 'major':
                if (semVer.major <= 0) {
                    return null;
                }
                semVer.major--;
                semVer.minor = semVer.patch = maxVerUnit;
                semVer.prerelease = [];
                break;
            case 'premajor':
                if (semVer.major <= 0) {
                    return null;
                }
                semVer.major--;
                semVer.minor = semVer.patch = maxVerUnit;
                semVer.prerelease = maxPrerelease;
                break;
            case 'minor':
                if (semVer.minor <= 0) {
                    return semverDecrement(v, 'major');
                }
                semVer.minor--;
                semVer.patch = maxVerUnit;
                semVer.prerelease = [];
                break;
            case 'preminor':
                if (semVer.minor <= 0) {
                    return semverDecrement(v, 'premajor');
                }
                semVer.minor--;
                semVer.patch = maxVerUnit;
                semVer.prerelease = maxPrerelease;
                break;
            case 'patch':
                if (semVer.patch <= 0) {
                    return semverDecrement(v, 'minor');
                }
                semVer.patch--;
                semVer.prerelease = [];
                break;
            case 'prepatch':
                if (semVer.patch <= 0) {
                    return semverDecrement(v, 'preminor');
                }
                semVer.patch--;
                semVer.prerelease = maxPrerelease;
                break;
            case 'prerelease':
                if (semVer.prerelease.length === 0) {
                    semVer.prerelease = maxPrerelease;
                } else if (
                    equal(semVer.prerelease, [0]) ||
                    equal(semVer.prerelease, ['0'])
                ) {
                    return semverDecrement(v, 'patch');
                } else {
                    semVer.prerelease = minPrerelease;
                }
                break;
            default:
                return null;
        }
        semVer.format();
        return semVer.version;
    } catch (e) {
        return null;
    }
}
