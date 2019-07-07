import semver from 'semver';

import { MultiRange } from './multi-range';
import { isIntersectRanges } from './utils';

export function intersect(...ranges: string[]): string | null {
    try {
        const rangeList = ranges.map(rangeStr => new semver.Range(rangeStr));

        if (!isIntersectRanges(rangeList)) {
            return null;
        }

        const intersectRange = rangeList
            .map(range => new MultiRange(range.set))
            .reduce(
                (multiRangeA, multiRangeB) =>
                    multiRangeA.intersect(multiRangeB),
                new MultiRange(null),
            );

        return intersectRange.valid ? String(intersectRange) : null;
    } catch (err) {
        return null;
    }
}
