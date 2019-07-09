import semver from 'semver';

import { MultiRange } from './multi-range';
import { isIntersectRanges } from './utils';

export function intersect(...ranges: string[]): string | null {
    const semverRangeList = (() => {
        try {
            return ranges.map(rangeStr => new semver.Range(rangeStr));
        } catch (err) {
            return null;
        }
    })();

    if (!semverRangeList || !isIntersectRanges(semverRangeList)) {
        return null;
    }

    const intersectRange = semverRangeList
        .map(range => new MultiRange(range.set))
        .reduce(
            (multiRangeA, multiRangeB) => multiRangeA.intersect(multiRangeB),
            new MultiRange(null),
        );

    return intersectRange.valid ? String(intersectRange) || '*' : null;
}
