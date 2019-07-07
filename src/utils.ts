import semver from 'semver';

export function uniqueArray<T>(array: readonly T[]): readonly T[] {
    return [...new Set(array)];
}

export function filterOperator(
    operatorList: semver.Comparator['operator'][],
): (comparator: semver.Comparator) => boolean {
    return comparator => operatorList.includes(comparator.operator);
}

export function getLowerBoundComparator(
    comparatorList: readonly semver.Comparator[],
): semver.Comparator {
    const validComparatorList = comparatorList.filter(
        filterOperator(['>', '>=']),
    );
    if (validComparatorList.length >= 1) {
        return validComparatorList.reduce((a, b) => {
            const semverCmp = semver.compare(a.semver, b.semver);
            if (a.operator === b.operator || semverCmp !== 0) {
                // >2.0.0  / >3.0.0  ... >3.0.0
                // >=1.0.0 / >=1.1.0 ... >=1.1.0
                // >2.0.0  / >=2.0.1 ... >=2.0.1
                // >=2.0.1 / >2.0.0  ... >=2.0.1
                // >2.0.1  / >=2.0.0 ... >2.0.1
                // >=2.0.0 / >2.0.1  ... >2.0.1
                if (semverCmp > 0) {
                    return a;
                } else {
                    return b;
                }
            } else {
                // >2.0.0  / >=2.0.0 ... >2.0.0
                // >=2.0.0 / >2.0.0  ... >2.0.0
                if (a.operator === '>') {
                    return a;
                } else {
                    return b;
                }
            }
        });
    } else {
        // x.x.x
        return new semver.Comparator('');
    }
}

export function getUpperBoundComparator(
    comparatorList: readonly semver.Comparator[],
): semver.Comparator {
    const validComparatorList = comparatorList.filter(
        filterOperator(['<', '<=']),
    );
    if (validComparatorList.length >= 1) {
        return validComparatorList.reduce((a, b) => {
            const semverCmp = semver.compare(a.semver, b.semver);
            if (a.operator === b.operator || semverCmp !== 0) {
                // <2.0.0  / <3.0.0  ... <2.0.0
                // <=1.0.0 / <=1.1.0 ... <=1.0.0
                // <2.0.0  / <=2.0.1 ... <2.0.0
                // <=2.0.1 / <2.0.0  ... <2.0.0
                // <2.0.1  / <=2.0.0 ... <=2.0.0
                // <=2.0.0 / <2.0.1  ... <=2.0.0
                if (semverCmp < 0) {
                    return a;
                } else {
                    return b;
                }
            } else {
                // <2.0.0  / <=2.0.0 ... <2.0.0
                // <=2.0.0 / <2.0.0  ... <2.0.0
                if (a.operator === '<') {
                    return a;
                } else {
                    return b;
                }
            }
        });
    } else {
        // x.x.x
        return new semver.Comparator('');
    }
}
