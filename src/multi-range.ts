import semver from 'semver';

import {
    getIntersectSingleRange,
    getSingleRange,
    isSingleRange,
    SingleRange,
    singleRange2string,
} from './single-range';
import { uniqueArray } from './utils';

type MultiRange = readonly SingleRange[];

export function getMultiRange(
    rangeSet: readonly (readonly semver.Comparator[])[],
): MultiRange {
    return rangeSet.map(comparatorList => getSingleRange(comparatorList));
}

export function multiRange2string(multiRange: MultiRange): string {
    return uniqueArray(multiRange.map(singleRange2string)).join(' || ');
}

export function getIntersectMultiRange(
    multiRangeA: MultiRange | null,
    multiRangeB: MultiRange | null,
): MultiRange | null {
    if (multiRangeA && multiRangeB) {
        const multiRange: MultiRange = multiRangeA
            .map(singleRangeA =>
                multiRangeB.map(singleRangeB =>
                    getIntersectSingleRange(singleRangeA, singleRangeB),
                ),
            )
            .reduce((a, b) => [...a, ...b])
            .filter(isSingleRange);

        if (multiRange.length < 1) {
            return null;
        }

        return multiRange;
    } else if (multiRangeA) {
        return multiRangeA;
    } else if (multiRangeB) {
        return multiRangeB;
    } else {
        return null;
    }
}
