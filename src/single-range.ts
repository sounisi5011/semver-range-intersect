import semver from 'semver';

import {
    filterUniqueComparator,
    getLowerBoundComparator,
    getUpperBoundComparator,
    isEqualsComparator,
    isPrerelease,
    isSameVersionEqualsLikeComparator,
    stripComparatorOperator,
} from './utils';

export interface SingleRangeInterface {
    toString(): string;
    intersect(
        singleRange: SingleVer | SingleRange,
    ): SingleVer | SingleRange | null;
    merge(singleRange: SingleVer | SingleRange): SingleVer | SingleRange | null;
}

export class SingleVer implements SingleRangeInterface {
    public comp: semver.Comparator;

    public constructor(comp: semver.Comparator) {
        this.comp = comp;
    }

    public toString(): string {
        return this.comp.value;
    }

    public intersect(singleRange: SingleVer | SingleRange): SingleVer | null {
        if (semver.intersects(String(this), String(singleRange))) {
            return this;
        } else {
            return null;
        }
    }

    public merge(
        singleRange: SingleVer | SingleRange,
    ): SingleVer | SingleRange | null {
        if (semver.intersects(String(this), String(singleRange))) {
            return singleRange;
        }
        return null;
    }
}

export class SingleRange implements SingleRangeInterface {
    public lowerBound: semver.Comparator;
    public upperBound: semver.Comparator;

    public constructor(
        lowerBound: semver.Comparator,
        upperBound: semver.Comparator,
    ) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        if (!lowerBound.intersects(upperBound)) {
            throw new Error(
                `Invalid range; version range does not intersect: ${this}`,
            );
        }
    }

    public toString(): string {
        return [this.lowerBound.value, this.upperBound.value]
            .filter(v => v !== '')
            .join(' ');
    }

    public intersect(
        singleRange: SingleVer | SingleRange,
    ): SingleVer | SingleRange | null {
        if (semver.intersects(String(this), String(singleRange))) {
            if (singleRange instanceof SingleVer) {
                return singleRange;
            } else {
                const lowerBound = getLowerBoundComparator([
                    this.lowerBound,
                    singleRange.lowerBound,
                ]);
                const upperBound = getUpperBoundComparator([
                    this.upperBound,
                    singleRange.upperBound,
                ]);

                if (isSameVersionEqualsLikeComparator(lowerBound, upperBound)) {
                    return new SingleVer(stripComparatorOperator(lowerBound));
                }

                return new SingleRange(lowerBound, upperBound);
            }
        } else {
            // Invalid range
            return null;
        }
    }

    public merge(
        singleRange: SingleVer | SingleRange,
    ): SingleVer | SingleRange | null {
        if (semver.intersects(String(this), String(singleRange))) {
            if (singleRange instanceof SingleVer) {
                return this;
            } else {
                const lowerBound = ((a, b) => {
                    const semverA: semver.SemVer | {} = a.semver;
                    const semverB: semver.SemVer | {} = b.semver;

                    // >2.0.0      / *           ... *
                    // >2.0.0-pre  / *           ... null
                    // >=2.0.0     / *           ... *
                    // >=2.0.0-pre / *           ... null
                    // *           / >2.0.0      ... *
                    // *           / >2.0.0-pre  ... null
                    // *           / >=2.0.0     ... *
                    // *           / >=2.0.0-pre ... null
                    // *           / *           ... *
                    if (!(semverA instanceof semver.SemVer)) {
                        if (isPrerelease(semverB)) {
                            return null;
                        }
                        return a;
                    } else if (!(semverB instanceof semver.SemVer)) {
                        if (isPrerelease(semverA)) {
                            return null;
                        }
                        return b;
                    }

                    // >=1.2.3-alpha / >=1.2.4-alpha ... null
                    // >=1.9.0-pre   / >=0.0.0       ... null
                    if (
                        isPrerelease(semverA) &&
                        isPrerelease(semverB) &&
                        semverA.compareMain(semverB) !== 0
                    ) {
                        return null;
                    }

                    const semverCmp = semver.compare(semverA, semverB);
                    if (a.operator === b.operator || semverCmp !== 0) {
                        // >2.0.0  / >3.0.0  ... >2.0.0
                        // >=1.0.0 / >=1.1.0 ... >=1.0.0
                        // >2.0.0  / >=2.0.1 ... >2.0.0
                        // >=2.0.1 / >2.0.0  ... >2.0.0
                        // >2.0.1  / >=2.0.0 ... >=2.0.0
                        // >=2.0.0 / >2.0.1  ... >=2.0.0
                        if (semverCmp < 0) {
                            return a;
                        } else {
                            return b;
                        }
                    } else {
                        // >2.0.0  / >=2.0.0 ... >=2.0.0
                        // >=2.0.0 / >2.0.0  ... >=2.0.0
                        if (a.operator === '>=') {
                            return a;
                        } else {
                            return b;
                        }
                    }
                })(this.lowerBound, singleRange.lowerBound);
                const upperBound = ((a, b) => {
                    const semverA: semver.SemVer | {} = a.semver;
                    const semverB: semver.SemVer | {} = b.semver;

                    // <2.0.0      / *           ... *
                    // <2.0.0-pre  / *           ... null
                    // <=2.0.0     / *           ... *
                    // <=2.0.0-pre / *           ... null
                    // *           / <2.0.0      ... *
                    // *           / <2.0.0-pre  ... null
                    // *           / <=2.0.0     ... *
                    // *           / <=2.0.0-pre ... null
                    // *           / *           ... *
                    if (!(semverA instanceof semver.SemVer)) {
                        if (isPrerelease(semverB)) {
                            return null;
                        }
                        return a;
                    } else if (!(semverB instanceof semver.SemVer)) {
                        if (isPrerelease(semverA)) {
                            return null;
                        }
                        return b;
                    }

                    // <=1.2.3-alpha / <=1.2.4-alpha ... null
                    // <=1.9.0-pre   / <=0.0.0       ... null
                    if (
                        isPrerelease(semverA) &&
                        isPrerelease(semverB) &&
                        semverA.compareMain(semverB) !== 0
                    ) {
                        return null;
                    }

                    const semverCmp = semver.compare(semverA, semverB);
                    if (a.operator === b.operator || semverCmp !== 0) {
                        // <2.0.0  / <3.0.0  ... <3.0.0
                        // <=1.0.0 / <=1.1.0 ... <=1.1.0
                        // <2.0.0  / <=2.0.1 ... <=2.0.1
                        // <=2.0.1 / <2.0.0  ... <=2.0.1
                        // <2.0.1  / <=2.0.0 ... <2.0.1
                        // <=2.0.0 / <2.0.1  ... <2.0.1
                        if (semverCmp > 0) {
                            return a;
                        } else {
                            return b;
                        }
                    } else {
                        // <2.0.0  / <=2.0.0 ... <=2.0.0
                        // <=2.0.0 / <2.0.0  ... <=2.0.0
                        if (a.operator === '<=') {
                            return a;
                        } else {
                            return b;
                        }
                    }
                })(this.upperBound, singleRange.upperBound);

                if (lowerBound && upperBound) {
                    return new SingleRange(lowerBound, upperBound);
                }
            }
        }
        return null;
    }
}

export function createSingleRange(
    comparatorList: readonly semver.Comparator[],
): SingleVer | SingleRange | null {
    const equalsComparatorList = comparatorList
        .filter(isEqualsComparator)
        .filter(filterUniqueComparator);
    switch (equalsComparatorList.length) {
        case 0: {
            const lowerBound = getLowerBoundComparator(comparatorList);
            const upperBound = getUpperBoundComparator(comparatorList);
            if (isSameVersionEqualsLikeComparator(lowerBound, upperBound)) {
                return new SingleVer(stripComparatorOperator(lowerBound));
            }
            try {
                return new SingleRange(lowerBound, upperBound);
            } catch (err) {
                return null;
            }
        }
        case 1:
            return new SingleVer(equalsComparatorList[0]);
        default:
            // Invalid range
            return null;
    }
}

export function isSingleRange(
    value: unknown,
): value is SingleVer | SingleRange {
    return value instanceof SingleVer || value instanceof SingleRange;
}
