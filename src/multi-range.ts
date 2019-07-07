import semver from 'semver';

import {
    createSingleRange,
    isSingleRange,
    SingleRange,
    SingleVer,
} from './single-range';
import { isNoIncludeNull, isNotNull, uniqueArray } from './utils';

export class MultiRange {
    public set: readonly (SingleVer | SingleRange)[];

    public get valid(): boolean {
        return this.set.length >= 1;
    }

    public constructor(
        rangeSet:
            | (readonly (
                  | SingleVer
                  | SingleRange
                  | null
                  | (readonly semver.Comparator[]))[])
            | null,
    ) {
        if (rangeSet) {
            const singleRangeList = rangeSet.map(
                singleRangeOrComparatorList => {
                    if (
                        isSingleRange(singleRangeOrComparatorList) ||
                        !singleRangeOrComparatorList
                    ) {
                        return singleRangeOrComparatorList;
                    } else {
                        return createSingleRange(singleRangeOrComparatorList);
                    }
                },
            );
            this.set = isNoIncludeNull(singleRangeList) ? singleRangeList : [];
        } else {
            this.set = [];
        }
    }

    public toString(): string {
        if (!this.valid) {
            throw new Error('Invalid range');
        }
        return uniqueArray(this.set.map(String)).join(' || ');
    }

    public intersect(multiRange: MultiRange): MultiRange {
        if (this.valid && multiRange.valid) {
            const multiRange2 = this.set
                .map(singleRangeA =>
                    multiRange.set.map(singleRangeB =>
                        singleRangeA.intersect(singleRangeB),
                    ),
                )
                .reduce((a, b) => [...a, ...b])
                .filter(isNotNull);

            return new MultiRange(multiRange2);
        } else if (this.valid) {
            return this;
        } else if (multiRange.valid) {
            return multiRange;
        } else {
            return new MultiRange(null);
        }
    }
}
