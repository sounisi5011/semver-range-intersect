import semver from 'semver';

import {
    getIntersectMultiRange,
    getMultiRange,
    multiRange2string,
} from './multi-range';

export function intersect(...ranges: string[]): string | null {
    try {
        const intersectRange = ranges
            .map(rangeStr => getMultiRange(new semver.Range(rangeStr).set))
            .reduce(getIntersectMultiRange, null);

        if (intersectRange) {
            return multiRange2string(intersectRange);
        }
    } catch (error) {
        if (
            !(
                error instanceof Error &&
                error.message.startsWith('Invalid range: ')
            )
        ) {
            throw error;
        }
    }

    return null;
}
