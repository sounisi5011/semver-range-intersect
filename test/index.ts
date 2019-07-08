import test, { Macro } from 'ava';
import semver from 'semver';

import { intersect } from '../src';

const validateOutputRangeMacro: Macro<[string[], string | null]> = (
    t,
    input,
    expected,
): void => {
    const intersectRange = intersect(...input);
    if (expected && intersectRange) {
        t.is(
            semver.validRange(intersectRange) || intersectRange,
            semver.validRange(expected) || expected,
        );
    } else {
        t.is(intersectRange, expected);
    }
};
validateOutputRangeMacro.title = (
    providedTitle = '',
    input,
    expected,
): string =>
    (providedTitle ? `${providedTitle} ` : '') +
    `intersect(${input
        .map(v => JSON.stringify(v))
        .join(', ')}) === ${JSON.stringify(expected)}`;

test('intersect() returns string type value', t => {
    t.is(typeof intersect('1.0.0'), 'string');
});
test('intersect() returns null if the argument version is invalid', t => {
    t.is(intersect('a.b.c'), null);
});

/*
 * @see https://github.com/snyamathi/semver-intersect/blob/491aebfe04cf1c7a6db89a425cd56c9af2c44902/tests/unit/semver-intersect.js#L137-L207
 */
test(validateOutputRangeMacro, ['4.0.0'], '4.0.0');
test(validateOutputRangeMacro, ['^4.0.0', '^4.3.0'], '^4.3.0');
test(validateOutputRangeMacro, ['^4.0.0', '~4.3.0'], '~4.3.0');
test(validateOutputRangeMacro, ['^1.0.0-alpha.3', '^1.2.0'], '^1.2.0');
test(
    validateOutputRangeMacro,
    ['^1.0.0-alpha.3', '^1.0.0-alpha.4'],
    '^1.0.0-alpha.4',
);
test(
    validateOutputRangeMacro,
    ['^0.14.0-beta2', '^0.14.0-beta3'],
    '^0.14.0-beta3',
);
test(
    validateOutputRangeMacro,
    ['^0.14.0-beta', '^0.14.0-beta4'],
    '^0.14.0-beta4',
);
test(validateOutputRangeMacro, ['^1.9.0-alpha', '^1.9.1-alpha'], '^1.9.1'); // Note: Is the correct return value "^1.9.1"? Or null? I do not understand well.
test(validateOutputRangeMacro, ['^1.9.0-alpha', '^1.9.0-beta'], '^1.9.0-beta');
test(validateOutputRangeMacro, ['^1.9.0-beta', '^1.9.0-alpha'], '^1.9.0-beta');
test(
    validateOutputRangeMacro,
    ['^1.9.0-alpha.1', '^1.9.0-beta.2'],
    '^1.9.0-beta.2',
);
test(validateOutputRangeMacro, ['1.9.0-alpha.1', '^1.9.0-alpha.2'], null);
test(validateOutputRangeMacro, ['1.9.0-alpha.1', '1.9.0-alpha.0'], null);
test(validateOutputRangeMacro, ['1.9.0-rc3', '^1.9.0-rc4'], null);
test(validateOutputRangeMacro, ['1.5.16', '^1.0.0'], '1.5.16');
test(
    validateOutputRangeMacro,
    ['^4.0.0', '~4.3.89', '~4.3.24', '~4.3.63'],
    '~4.3.89',
);
test(validateOutputRangeMacro, ['^4.0.0', '~4.3.0', '^4.4.0'], null);
test(validateOutputRangeMacro, ['1.0.0 - 1.5.3'], '1.0.0 - 1.5.3');
test(validateOutputRangeMacro, ['^5.0.0', '^4.0.1'], null);
test(validateOutputRangeMacro, ['^5.0.0', '^3.0.0'], null);
test(validateOutputRangeMacro, ['~5.1.0', '~5.2.0'], null);
test(validateOutputRangeMacro, ['^0.5.0', '^0.4.0'], null);

// Note: I am not sure if this test is correct
[
    ['<=1.9.0-alpha', '<=1.9.1-alpha'],
    ['<1.9.0-alpha', '<1.9.1-alpha'],
    ['<=1.9.0-alpha', '<1.9.1-alpha'],
    ['<1.9.0-alpha', '<=1.9.1-alpha'],
].forEach(inputRangeList => {
    [
        '<1.9.0-alpha',
        '<1.9.0',
        '<=1.9.0-alpha',
        '<=1.9.0',
        '<1.9.1-alpha',
        '<1.9.1',
        '<=1.9.1-alpha',
        '<=1.9.1',
    ]
        .filter(expectedRange =>
            [
                '1.8.99',
                '1.9.0-1',
                '1.9.0-alpha',
                '1.9.0-beta',
                '1.9.0',
                '1.9.1-1',
                '1.9.1-alpha',
                '1.9.1-beta',
                '1.9.1',
                '1.9.2-1',
                '1.9.2-alpha',
                '1.9.2-beta',
                '1.9.2',
            ].every(
                v =>
                    inputRangeList.every(r => semver.satisfies(v, r)) ===
                    semver.satisfies(v, expectedRange),
            ),
        )
        .forEach(expectedRange => {
            test(validateOutputRangeMacro, inputRangeList, expectedRange);
        });
});

test(validateOutputRangeMacro, ['1.1 - 1.3', '1.2 - 1.4'], '1.2 - 1.3');
test(
    validateOutputRangeMacro,
    ['1.0.1 - 1.0.11', '1.0.5 - 1.0.15', '1.0.16 - 1.1.0'],
    null,
);
test(validateOutputRangeMacro, ['2.2 - 2.9', '2.1.6 - 2.8.5'], '2.2 - 2.8.5');

test(validateOutputRangeMacro, ['>=8.0.0 >=8.16.0'], '>=8.16.0');
test(validateOutputRangeMacro, ['>=8.2.0 >=8.1.0 <8.3.0'], '>=8.2.0 <8.3.0');
test(validateOutputRangeMacro, ['^8.0.0 || ^8.1.0'], '^8.0.0');
test(validateOutputRangeMacro, ['1.1 - 1.3 || 1.2 - 1.4'], '1.1 - 1.4');
test(
    validateOutputRangeMacro,
    ['1.0.1 - 1.0.11 || 1.0.5 - 1.0.15 || 1.0.16 - 1.1.0'],
    '1.0.1 - 1.0.15 || 1.0.16 - 1.1.0',
);
test(
    validateOutputRangeMacro,
    ['1.0.1 - 1.0.11 || 1.0.16 - 1.1.0 || 1.0.5 - 1.0.15'],
    '1.0.1 - 1.0.15 || 1.0.16 - 1.1.0',
);
test(validateOutputRangeMacro, ['2.2 - 2.9 || 2.1.6 - 2.8.5'], '2.1.6 - 2.9');
test(validateOutputRangeMacro, ['^8 || 8.3.6 || 8.19.7'], '^8');
test(validateOutputRangeMacro, ['8.3.6 || ^8 || 8.19.7'], '^8');
test(validateOutputRangeMacro, ['8.3.6 || 8.19.7 || ^8'], '^8');
test(validateOutputRangeMacro, ['^8 || 8.3.6 || ^8 || 8.19.7'], '^8');
test(validateOutputRangeMacro, ['^8 || ^8 || ^8'], '^8');
test(validateOutputRangeMacro, ['^8 || ^9 || ^8'], '^8 || ^9');
test(validateOutputRangeMacro, ['^9 || ^8 || ^8'], '^9 || ^8');
test(validateOutputRangeMacro, ['^9 || ^8 || ^9'], '^9 || ^8');

test(
    validateOutputRangeMacro,
    ['>=8.9.4 <9 || >=10.0.0', '^6.14.0 || ^8.10.0 || >=9.10.0'],
    '^8.10.0 || >=10.0.0',
);
test(
    validateOutputRangeMacro,
    ['^8.15.0 || >=10.0.0', '^8.10.0 || ^10.13.0 || >=11.10.1'],
    '^8.15.0 || ^10.13.0 || >=11.10.1',
);
test(
    validateOutputRangeMacro,
    [
        '^8.15.1 || ^9.0.7 || ^12.0.0',
        '8.16 || >=9.7.1 || >=11.58',
        '0.x - 11.x || >=12.8.2',
    ],
    '8.16 || ^9.7.1 || ^12.8.2',
);
