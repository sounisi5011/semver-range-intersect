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

export function isPrerelease(version: semver.SemVer | {}): boolean {
    if (version instanceof semver.SemVer) {
        return version.prerelease.length !== 0;
    } else {
        return false;
    }
}

export function isValidOperator(
    comparator: semver.Comparator,
    operatorList: readonly semver.Comparator['operator'][],
): boolean {
    return operatorList.includes(comparator.operator);
}

export function equalComparator(
    comparatorA: semver.Comparator,
    comparatorB: semver.Comparator,
): boolean {
    return comparatorA.value === comparatorB.value;
}

export function comparator2versionStr(comparator: semver.Comparator): string {
    const compSemver: semver.SemVer | {} = comparator.semver;
    return compSemver instanceof semver.SemVer ? compSemver.version : '';
}

// 1.2.3   / 1.2.3   ... true
// >=1.2.3 / <=1.2.3 ... true
// >=1.2.3 / 1.2.3   ... true
// >1.2.3  / <1.2.3  ... false
// >=1.2.3 / <1.2.3  ... false
// *       / *       ... false
// 1.2.3   / *       ... false
// >=1.2.3 / *       ... false
export function isSameVersionEqualsLikeComparator(
    comparatorA: semver.Comparator,
    comparatorB: semver.Comparator,
): boolean {
    const compVersionA = comparator2versionStr(comparatorA);
    const compVersionB = comparator2versionStr(comparatorB);
    return (
        compVersionA !== '' &&
        compVersionB !== '' &&
        compVersionA === compVersionB &&
        /=|^$/.test(comparatorA.operator) &&
        /=|^$/.test(comparatorB.operator)
    );
}

export function isEqualsComparator(comparator: semver.Comparator): boolean {
    return (
        comparator.semver instanceof semver.SemVer &&
        isValidOperator(comparator, ['', '='])
    );
}

export function filterUniqueComparator(
    comparator: semver.Comparator,
    index: number,
    self: readonly semver.Comparator[],
): boolean {
    return self.findIndex(comp => equalComparator(comparator, comp)) === index;
}

export function filterOperator(
    operatorList: readonly semver.Comparator['operator'][],
): (comparator: semver.Comparator) => boolean {
    return comparator => isValidOperator(comparator, operatorList);
}

export function isIntersectRanges(
    semverRangeList: readonly semver.Range[],
): boolean {
    return semverRangeList.every((rangeA, index, rangeList) =>
        rangeList.slice(index + 1).every(rangeB => rangeA.intersects(rangeB)),
    );
}

export function stripSemVerPrerelease(semverVersion: semver.SemVer): string {
    if (!semverVersion.prerelease.length) {
        return semverVersion.version;
    }
    const newSemverVersion = new semver.SemVer(
        semverVersion.version,
        semverVersion.options,
    );
    newSemverVersion.prerelease = [];
    return newSemverVersion.format();
}

export function stripComparatorOperator(
    comparator: semver.Comparator,
): semver.Comparator {
    if (!comparator.operator) {
        return comparator;
    }
    const versionStr = comparator2versionStr(comparator);
    return new semver.Comparator(versionStr, comparator.options);
}

export function getLowerBoundComparator(
    comparatorList: readonly semver.Comparator[],
): semver.Comparator {
    const validComparatorList = comparatorList.filter(
        filterOperator(['>', '>=']),
    );
    if (validComparatorList.length >= 1) {
        return validComparatorList.reduce((a, b) => {
            const semverA: semver.SemVer | {} = a.semver;
            const semverB: semver.SemVer | {} = b.semver;

            // >2.0.0  / *       ... >2.0.0
            // >=2.0.0 / *       ... >=2.0.0
            // *       / >2.0.0  ... >2.0.0
            // *       / >=2.0.0 ... >=2.0.0
            // *       / *       ... *
            if (!(semverA instanceof semver.SemVer)) {
                return b;
            } else if (!(semverB instanceof semver.SemVer)) {
                return a;
            }

            const semverCmp = semver.compare(semverA, semverB);
            if (a.operator === b.operator || semverCmp !== 0) {
                const semverCmpMain = semverA.compareMain(semverB);
                if (
                    semverCmpMain !== 0 &&
                    semverA.prerelease.length &&
                    semverB.prerelease.length
                ) {
                    // ^1.9.0-alpha / ^1.9.1-alpha ... ^1.9.1
                    if (semverCmpMain > 0) {
                        return new semver.Comparator(
                            a.operator + stripSemVerPrerelease(semverA),
                            a.options,
                        );
                    } else {
                        return new semver.Comparator(
                            b.operator + stripSemVerPrerelease(semverB),
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
            const semverA: semver.SemVer | {} = a.semver;
            const semverB: semver.SemVer | {} = b.semver;

            // <2.0.0  / *       ... <2.0.0
            // <=2.0.0 / *       ... <=2.0.0
            // *       / <2.0.0  ... <2.0.0
            // *       / <=2.0.0 ... <=2.0.0
            // *       / *       ... *
            if (!(semverA instanceof semver.SemVer)) {
                return b;
            } else if (!(semverB instanceof semver.SemVer)) {
                return a;
            }

            const semverCmp = semver.compare(semverA, semverB);
            if (a.operator === b.operator || semverCmp !== 0) {
                const semverCmpMain = semverA.compareMain(semverB);
                if (
                    semverCmpMain !== 0 &&
                    semverA.prerelease.length &&
                    semverB.prerelease.length
                ) {
                    // <=1.9.0-alpha / <=1.9.1-alpha ... <1.9.0
                    // <1.9.0-alpha  / <1.9.1-alpha  ... <1.9.0
                    // <=1.9.0-alpha / <1.9.1-alpha  ... <1.9.0
                    // <1.9.0-alpha  / <=1.9.1-alpha ... <1.9.0
                    if (semverCmpMain < 0) {
                        return new semver.Comparator(
                            `<${stripSemVerPrerelease(semverA)}`,
                            a.options,
                        );
                    } else {
                        return new semver.Comparator(
                            `<${stripSemVerPrerelease(semverB)}`,
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
