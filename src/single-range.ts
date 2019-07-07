import semver from 'semver';

import {
    filterOperator,
    getLowerBoundComparator,
    getUpperBoundComparator,
} from './utils';

export type SingleRange =
    | {
          raw: string;
          equals: semver.Comparator;
          lowerBound: null;
          upperBound: null;
      }
    | {
          raw: string;
          equals: null;
          lowerBound: semver.Comparator;
          upperBound: semver.Comparator;
      };

export function getSingleRange(
    comparatorList: readonly semver.Comparator[],
): SingleRange {
    const rawRangeStr = comparatorList.map(String).join(' ');

    const equalsComparatorList = comparatorList.filter(
        filterOperator(['', '=']),
    );
    switch (equalsComparatorList.length) {
        case 0:
            break;
        case 1:
            return {
                raw: rawRangeStr,
                equals: equalsComparatorList[0],
                lowerBound: null,
                upperBound: null,
            };
        default:
            throw new Error(`Invalid range: ${rawRangeStr}`);
    }

    return {
        raw: rawRangeStr,
        equals: null,
        lowerBound: getLowerBoundComparator(comparatorList),
        upperBound: getUpperBoundComparator(comparatorList),
    };
}

export function isSingleRange(value: SingleRange | null): value is SingleRange {
    return Boolean(value);
}

export function singleRange2string(singleRange: SingleRange): string {
    if (singleRange.equals) {
        return singleRange.equals.value;
    } else {
        return `${singleRange.lowerBound.value} ${singleRange.upperBound.value}`;
    }
}

export function getIntersectSingleRange(
    singleRangeA: SingleRange,
    singleRangeB: SingleRange,
): SingleRange | null {
    if (
        semver.intersects(
            singleRange2string(singleRangeA),
            singleRange2string(singleRangeB),
        )
    ) {
        if (singleRangeA.equals) {
            return singleRangeA;
        } else if (singleRangeB.equals) {
            return singleRangeB;
        } else {
            return {
                raw: `${singleRangeA.raw} ${singleRangeB.raw}`,
                equals: null,
                lowerBound: getLowerBoundComparator([
                    singleRangeA.lowerBound,
                    singleRangeB.lowerBound,
                ]),
                upperBound: getUpperBoundComparator([
                    singleRangeA.upperBound,
                    singleRangeB.upperBound,
                ]),
            };
        }
    } else {
        return null;
    }
}
