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
        rangeList:
            | (readonly (
                  | SingleVer
                  | SingleRange
                  | null
                  | (readonly semver.Comparator[]))[])
            | null,
    ) {
        if (rangeList) {
            const singleRangeList = rangeList.map(
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
            const singleRangeList = this.set
                .map(singleRangeA =>
                    multiRange.set.map(singleRangeB =>
                        singleRangeA.intersect(singleRangeB),
                    ),
                )
                .reduce((a, b) => [...a, ...b])
                .filter(isNotNull);

            return new MultiRange(singleRangeList);
        } else if (this.valid) {
            return this;
        } else if (multiRange.valid) {
            return multiRange;
        } else {
            return new MultiRange(null);
        }
    }
}
