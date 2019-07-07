import semver from 'semver';

import { MultiRange } from './multi-range';

export function intersect(...ranges: string[]): string | null {
    const intersectRange = ranges
        .map(rangeStr => new MultiRange(new semver.Range(rangeStr).set))
        .reduce(
            (multiRangeA, multiRangeB) => multiRangeA.intersect(multiRangeB),
            new MultiRange(null),
        );

    return intersectRange.valid ? String(intersectRange) : null;
}
