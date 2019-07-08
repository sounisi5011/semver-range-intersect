import semver from 'semver';

import {
    filterOperator,
    getLowerBoundComparator,
    getUpperBoundComparator,
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
    }

    public toString(): string {
        return `${this.lowerBound.value} ${this.upperBound.value}`;
    }

    public intersect(
        singleRange: SingleVer | SingleRange,
    ): SingleVer | SingleRange | null {
        if (semver.intersects(String(this), String(singleRange))) {
            if (singleRange instanceof SingleVer) {
                return singleRange;
            } else {
                return new SingleRange(
                    getLowerBoundComparator([
                        this.lowerBound,
                        singleRange.lowerBound,
                    ]),
                    getUpperBoundComparator([
                        this.upperBound,
                        singleRange.upperBound,
                    ]),
                );
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
                    const semverCmp = semver.compare(a.semver, b.semver);
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
                    const semverCmp = semver.compare(a.semver, b.semver);
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

                return new SingleRange(lowerBound, upperBound);
            }
        }
        return null;
    }
}

export function createSingleRange(
    comparatorList: readonly semver.Comparator[],
): SingleVer | SingleRange | null {
    const equalsComparatorList = comparatorList.filter(
        filterOperator(['', '=']),
    );
    switch (equalsComparatorList.length) {
        case 0:
            return new SingleRange(
                getLowerBoundComparator(comparatorList),
                getUpperBoundComparator(comparatorList),
            );
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
