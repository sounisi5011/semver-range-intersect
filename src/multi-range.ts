import semver from 'semver';

import {
    createSingleRange,
    isSingleRange,
    SingleRange,
    SingleVer,
} from './single-range';
import { isNoIncludeNull, isNotNull, uniqueArray } from './utils';

export function normalizeSingleRangeList(
    singleRangeList: readonly (SingleVer | SingleRange | null)[],
): readonly (SingleVer | SingleRange | null)[] {
    return singleRangeList.reduce(
        (singleRangeList, singleRange) => {
            if (!singleRange) {
                return [...singleRangeList, singleRange];
            }

            let insertFirst = false;
            const removeIndexList: number[] = [];
            const appendSingleRange = singleRangeList.reduce<
                typeof singleRange | void
            >((appendSingleRange, insertedSingleRange, index) => {
                if (insertedSingleRange && appendSingleRange) {
                    const mergedSingleRange = insertedSingleRange.merge(
                        appendSingleRange,
                    );
                    if (mergedSingleRange) {
                        if (
                            String(mergedSingleRange) ===
                            String(insertedSingleRange)
                        ) {
                            return;
                        } else {
                            removeIndexList.push(index);
                            if (
                                insertedSingleRange instanceof SingleRange &&
                                appendSingleRange instanceof SingleRange
                            ) {
                                insertFirst = true;
                            }
                            return mergedSingleRange;
                        }
                    }
                }
                return appendSingleRange;
            }, singleRange);

            const removedSingleRangeList = singleRangeList.filter(
                (_, index) => !removeIndexList.includes(index),
            );
            if (appendSingleRange) {
                if (insertFirst) {
                    return [appendSingleRange, ...removedSingleRangeList];
                } else {
                    return [...removedSingleRangeList, appendSingleRange];
                }
            }
            return removedSingleRangeList;
        },
        [] as (SingleVer | SingleRange | null)[],
    );
}

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
            const singleRangeList = normalizeSingleRangeList(
                rangeList.map(singleRangeOrComparatorList => {
                    if (
                        isSingleRange(singleRangeOrComparatorList) ||
                        !singleRangeOrComparatorList
                    ) {
                        return singleRangeOrComparatorList;
                    } else {
                        return createSingleRange(singleRangeOrComparatorList);
                    }
                }),
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
