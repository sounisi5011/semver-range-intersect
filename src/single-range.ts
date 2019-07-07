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
