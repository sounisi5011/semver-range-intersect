import semver from 'semver';

export function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}

export function uniqueArray<T>(array: readonly T[]): readonly T[] {
    return [...new Set(array)];
}

export function isNoIncludeNull<T>(
    value: readonly (T | null)[],
): value is readonly T[] {
    return value.every(isNotNull);
}

export function filterOperator(
    operatorList: readonly semver.Comparator['operator'][],
): (comparator: semver.Comparator) => boolean {
    return comparator => operatorList.includes(comparator.operator);
}

export function isIntersectRanges(rangeList: readonly semver.Range[]): boolean {
    return rangeList.every((rangeA, index, rangeList) =>
        rangeList.slice(index + 1).every(rangeB => rangeA.intersects(rangeB)),
    );
}

export function stripSemVerPrerelease(version: semver.SemVer): string {
    if (!version.prerelease.length) {
        return version.version;
    }
    const newVersion = new semver.SemVer(version.version, version.options);
    newVersion.prerelease = [];
    return newVersion.format();
}

export function getLowerBoundComparator(
    comparatorList: readonly semver.Comparator[],
): semver.Comparator {
    const validComparatorList = comparatorList.filter(
        filterOperator(['>', '>=']),
    );
    if (validComparatorList.length >= 1) {
        return validComparatorList.reduce((a, b) => {
            const semverCmp = semver.compare(a.semver, b.semver);
            if (a.operator === b.operator || semverCmp !== 0) {
                const semverCmpMain = a.semver.compareMain(b.semver);
                if (
                    semverCmpMain !== 0 &&
                    a.semver.prerelease.length &&
                    b.semver.prerelease.length
                ) {
                    // ^1.9.0-alpha / ^1.9.1-alpha ... ^1.9.1
                    if (semverCmpMain > 0) {
                        return new semver.Comparator(
                            a.operator + stripSemVerPrerelease(a.semver),
                            a.options,
                        );
                    } else {
                        return new semver.Comparator(
                            b.operator + stripSemVerPrerelease(b.semver),
                            b.options,
                        );
                    }
                }

                // >2.0.0  / >3.0.0  ... >3.0.0
                // >=1.0.0 / >=1.1.0 ... >=1.1.0
                // >2.0.0  / >=2.0.1 ... >=2.0.1
                // >=2.0.1 / >2.0.0  ... >=2.0.1
                // >2.0.1  / >=2.0.0 ... >2.0.1
                // >=2.0.0 / >2.0.1  ... >2.0.1
                if (semverCmp > 0) {
                    return a;
                } else {
                    return b;
                }
            } else {
                // >2.0.0  / >=2.0.0 ... >2.0.0
                // >=2.0.0 / >2.0.0  ... >2.0.0
                if (a.operator === '>') {
                    return a;
                } else {
                    return b;
                }
            }
        });
    } else {
        // x.x.x
        return new semver.Comparator('');
    }
}

export function getUpperBoundComparator(
    comparatorList: readonly semver.Comparator[],
): semver.Comparator {
    const validComparatorList = comparatorList.filter(
        filterOperator(['<', '<=']),
    );
    if (validComparatorList.length >= 1) {
        return validComparatorList.reduce((a, b) => {
            const semverCmp = semver.compare(a.semver, b.semver);
            if (a.operator === b.operator || semverCmp !== 0) {
                const semverCmpMain = a.semver.compareMain(b.semver);
                if (
                    semverCmpMain !== 0 &&
                    a.semver.prerelease.length &&
                    b.semver.prerelease.length
                ) {
                    // <=1.9.0-alpha / <=1.9.1-alpha ... <1.9.0
                    // <1.9.0-alpha  / <1.9.1-alpha  ... <1.9.0
                    // <=1.9.0-alpha / <1.9.1-alpha  ... <1.9.0
                    // <1.9.0-alpha  / <=1.9.1-alpha ... <1.9.0
                    if (semverCmpMain < 0) {
                        return new semver.Comparator(
                            `<${stripSemVerPrerelease(a.semver)}`,
                            a.options,
                        );
                    } else {
                        return new semver.Comparator(
                            `<${stripSemVerPrerelease(b.semver)}`,
                            b.options,
                        );
                    }
                }

                // <2.0.0  / <3.0.0  ... <2.0.0
                // <=1.0.0 / <=1.1.0 ... <=1.0.0
                // <2.0.0  / <=2.0.1 ... <2.0.0
                // <=2.0.1 / <2.0.0  ... <2.0.0
                // <2.0.1  / <=2.0.0 ... <=2.0.0
                // <=2.0.0 / <2.0.1  ... <=2.0.0
                if (semverCmp < 0) {
                    return a;
                } else {
                    return b;
                }
            } else {
                // <2.0.0  / <=2.0.0 ... <2.0.0
                // <=2.0.0 / <2.0.0  ... <2.0.0
                if (a.operator === '<') {
                    return a;
                } else {
                    return b;
                }
            }
        });
    } else {
        // x.x.x
        return new semver.Comparator('');
    }
}
