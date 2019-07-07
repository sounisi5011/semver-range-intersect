import semver from 'semver';

import {
    getIntersectMultiRange,
    getMultiRange,
    multiRange2string,
} from './multi-range';

export function intersect(...ranges: string[]): string {
    const intersectRange = ranges
        .map(rangeStr => getMultiRange(new semver.Range(rangeStr).set))
        .reduce(getIntersectMultiRange, null);

    if (!intersectRange) {
        throw new Error('Invalid range');
    }

    return multiRange2string(intersectRange);
}
