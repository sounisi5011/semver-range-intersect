import test, { Macro } from 'ava';
import semver from 'semver';

import { semverDecrement } from './helpers';

const validateSemverDecrementMacro: Macro<
    [string, semver.ReleaseType, string | null]
> = (t, version, release, expected): void => {
    t.is(semverDecrement(version, release), expected);
};
validateSemverDecrementMacro.title = (
    providedTitle = '',
    version,
    release,
    expected,
): string =>
    (providedTitle ? `${providedTitle} ` : '') +
    `semverDecrement(${JSON.stringify(version)}, ${JSON.stringify(
        release,
    )}) === ${JSON.stringify(expected)}`;

test(validateSemverDecrementMacro, '17.3.9', 'major', '16.9999.9999');
test(
    validateSemverDecrementMacro,
    '17.3.9',
    'premajor',
    '16.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '17.3.9', 'minor', '17.2.9999');
test(
    validateSemverDecrementMacro,
    '17.3.9',
    'preminor',
    '17.2.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '17.3.9', 'patch', '17.3.8');
test(validateSemverDecrementMacro, '17.3.9', 'prepatch', '17.3.8-zzzzzzzzzz');
test(validateSemverDecrementMacro, '17.3.9', 'prerelease', '17.3.9-zzzzzzzzzz');

test(validateSemverDecrementMacro, '17.3.9-pre', 'major', '16.9999.9999');
test(
    validateSemverDecrementMacro,
    '17.3.9-pre',
    'premajor',
    '16.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '17.3.9-pre', 'minor', '17.2.9999');
test(
    validateSemverDecrementMacro,
    '17.3.9-pre',
    'preminor',
    '17.2.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '17.3.9-pre', 'patch', '17.3.8');
test(
    validateSemverDecrementMacro,
    '17.3.9-pre',
    'prepatch',
    '17.3.8-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '17.3.9-pre', 'prerelease', '17.3.9-0');

test(validateSemverDecrementMacro, '1.1.1', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.1.1',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.1.1', 'minor', '1.0.9999');
test(validateSemverDecrementMacro, '1.1.1', 'preminor', '1.0.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '1.1.1', 'patch', '1.1.0');
test(validateSemverDecrementMacro, '1.1.1', 'prepatch', '1.1.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '1.1.1', 'prerelease', '1.1.1-zzzzzzzzzz');

test(validateSemverDecrementMacro, '1.1.1-pre', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.1.1-pre',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.1.1-pre', 'minor', '1.0.9999');
test(
    validateSemverDecrementMacro,
    '1.1.1-pre',
    'preminor',
    '1.0.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.1.1-pre', 'patch', '1.1.0');
test(validateSemverDecrementMacro, '1.1.1-pre', 'prepatch', '1.1.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '1.1.1-pre', 'prerelease', '1.1.1-0');

test(validateSemverDecrementMacro, '1.1.0', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.1.0',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.1.0', 'minor', '1.0.9999');
test(validateSemverDecrementMacro, '1.1.0', 'preminor', '1.0.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '1.1.0', 'patch', '1.0.9999');
test(validateSemverDecrementMacro, '1.1.0', 'prepatch', '1.0.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '1.1.0', 'prerelease', '1.1.0-zzzzzzzzzz');

test(validateSemverDecrementMacro, '1.1.0-pre', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.1.0-pre',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.1.0-pre', 'minor', '1.0.9999');
test(
    validateSemverDecrementMacro,
    '1.1.0-pre',
    'preminor',
    '1.0.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.1.0-pre', 'patch', '1.0.9999');
test(
    validateSemverDecrementMacro,
    '1.1.0-pre',
    'prepatch',
    '1.0.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.1.0-pre', 'prerelease', '1.1.0-0');

test(validateSemverDecrementMacro, '1.0.1', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.1',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.1', 'minor', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.1',
    'preminor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.1', 'patch', '1.0.0');
test(validateSemverDecrementMacro, '1.0.1', 'prepatch', '1.0.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '1.0.1', 'prerelease', '1.0.1-zzzzzzzzzz');

test(validateSemverDecrementMacro, '1.0.1-pre', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.1-pre',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.1-pre', 'minor', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.1-pre',
    'preminor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.1-pre', 'patch', '1.0.0');
test(validateSemverDecrementMacro, '1.0.1-pre', 'prepatch', '1.0.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '1.0.1-pre', 'prerelease', '1.0.1-0');

test(validateSemverDecrementMacro, '1.0.0', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.0',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.0', 'minor', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.0',
    'preminor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.0', 'patch', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.0',
    'prepatch',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.0', 'prerelease', '1.0.0-zzzzzzzzzz');

test(validateSemverDecrementMacro, '1.0.0-pre', 'major', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.0-pre',
    'premajor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.0-pre', 'minor', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.0-pre',
    'preminor',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.0-pre', 'patch', '0.9999.9999');
test(
    validateSemverDecrementMacro,
    '1.0.0-pre',
    'prepatch',
    '0.9999.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '1.0.0-pre', 'prerelease', '1.0.0-0');

test(validateSemverDecrementMacro, '0.1.1', 'major', null);
test(validateSemverDecrementMacro, '0.1.1', 'premajor', null);
test(validateSemverDecrementMacro, '0.1.1', 'minor', '0.0.9999');
test(validateSemverDecrementMacro, '0.1.1', 'preminor', '0.0.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.1.1', 'patch', '0.1.0');
test(validateSemverDecrementMacro, '0.1.1', 'prepatch', '0.1.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.1.1', 'prerelease', '0.1.1-zzzzzzzzzz');

test(validateSemverDecrementMacro, '0.1.1-pre', 'major', null);
test(validateSemverDecrementMacro, '0.1.1-pre', 'premajor', null);
test(validateSemverDecrementMacro, '0.1.1-pre', 'minor', '0.0.9999');
test(
    validateSemverDecrementMacro,
    '0.1.1-pre',
    'preminor',
    '0.0.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '0.1.1-pre', 'patch', '0.1.0');
test(validateSemverDecrementMacro, '0.1.1-pre', 'prepatch', '0.1.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.1.1-pre', 'prerelease', '0.1.1-0');

test(validateSemverDecrementMacro, '0.3.0', 'major', null);
test(validateSemverDecrementMacro, '0.3.0', 'premajor', null);
test(validateSemverDecrementMacro, '0.3.0', 'minor', '0.2.9999');
test(validateSemverDecrementMacro, '0.3.0', 'preminor', '0.2.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.3.0', 'patch', '0.2.9999');
test(validateSemverDecrementMacro, '0.3.0', 'prepatch', '0.2.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.3.0', 'prerelease', '0.3.0-zzzzzzzzzz');

test(validateSemverDecrementMacro, '0.3.0-pre', 'major', null);
test(validateSemverDecrementMacro, '0.3.0-pre', 'premajor', null);
test(validateSemverDecrementMacro, '0.3.0-pre', 'minor', '0.2.9999');
test(
    validateSemverDecrementMacro,
    '0.3.0-pre',
    'preminor',
    '0.2.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '0.3.0-pre', 'patch', '0.2.9999');
test(
    validateSemverDecrementMacro,
    '0.3.0-pre',
    'prepatch',
    '0.2.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '0.3.0-pre', 'prerelease', '0.3.0-0');

test(validateSemverDecrementMacro, '0.1.0', 'major', null);
test(validateSemverDecrementMacro, '0.1.0', 'premajor', null);
test(validateSemverDecrementMacro, '0.1.0', 'minor', '0.0.9999');
test(validateSemverDecrementMacro, '0.1.0', 'preminor', '0.0.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.1.0', 'patch', '0.0.9999');
test(validateSemverDecrementMacro, '0.1.0', 'prepatch', '0.0.9999-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.1.0', 'prerelease', '0.1.0-zzzzzzzzzz');

test(validateSemverDecrementMacro, '0.1.0-pre', 'major', null);
test(validateSemverDecrementMacro, '0.1.0-pre', 'premajor', null);
test(validateSemverDecrementMacro, '0.1.0-pre', 'minor', '0.0.9999');
test(
    validateSemverDecrementMacro,
    '0.1.0-pre',
    'preminor',
    '0.0.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '0.1.0-pre', 'patch', '0.0.9999');
test(
    validateSemverDecrementMacro,
    '0.1.0-pre',
    'prepatch',
    '0.0.9999-zzzzzzzzzz',
);
test(validateSemverDecrementMacro, '0.1.0-pre', 'prerelease', '0.1.0-0');

test(validateSemverDecrementMacro, '0.0.7', 'major', null);
test(validateSemverDecrementMacro, '0.0.7', 'premajor', null);
test(validateSemverDecrementMacro, '0.0.7', 'minor', null);
test(validateSemverDecrementMacro, '0.0.7', 'preminor', null);
test(validateSemverDecrementMacro, '0.0.7', 'patch', '0.0.6');
test(validateSemverDecrementMacro, '0.0.7', 'prepatch', '0.0.6-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.0.7', 'prerelease', '0.0.7-zzzzzzzzzz');

test(validateSemverDecrementMacro, '0.0.7-pre', 'major', null);
test(validateSemverDecrementMacro, '0.0.7-pre', 'premajor', null);
test(validateSemverDecrementMacro, '0.0.7-pre', 'minor', null);
test(validateSemverDecrementMacro, '0.0.7-pre', 'preminor', null);
test(validateSemverDecrementMacro, '0.0.7-pre', 'patch', '0.0.6');
test(validateSemverDecrementMacro, '0.0.7-pre', 'prepatch', '0.0.6-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.0.7-pre', 'prerelease', '0.0.7-0');

test(validateSemverDecrementMacro, '0.0.1', 'major', null);
test(validateSemverDecrementMacro, '0.0.1', 'premajor', null);
test(validateSemverDecrementMacro, '0.0.1', 'minor', null);
test(validateSemverDecrementMacro, '0.0.1', 'preminor', null);
test(validateSemverDecrementMacro, '0.0.1', 'patch', '0.0.0');
test(validateSemverDecrementMacro, '0.0.1', 'prepatch', '0.0.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.0.1', 'prerelease', '0.0.1-zzzzzzzzzz');

test(validateSemverDecrementMacro, '0.0.1-pre', 'major', null);
test(validateSemverDecrementMacro, '0.0.1-pre', 'premajor', null);
test(validateSemverDecrementMacro, '0.0.1-pre', 'minor', null);
test(validateSemverDecrementMacro, '0.0.1-pre', 'preminor', null);
test(validateSemverDecrementMacro, '0.0.1-pre', 'patch', '0.0.0');
test(validateSemverDecrementMacro, '0.0.1-pre', 'prepatch', '0.0.0-zzzzzzzzzz');
test(validateSemverDecrementMacro, '0.0.1-pre', 'prerelease', '0.0.1-0');

test(validateSemverDecrementMacro, '0.0.0', 'major', null);
test(validateSemverDecrementMacro, '0.0.0', 'premajor', null);
test(validateSemverDecrementMacro, '0.0.0', 'minor', null);
test(validateSemverDecrementMacro, '0.0.0', 'preminor', null);
test(validateSemverDecrementMacro, '0.0.0', 'patch', null);
test(validateSemverDecrementMacro, '0.0.0', 'prepatch', null);
test(validateSemverDecrementMacro, '0.0.0', 'prerelease', '0.0.0-zzzzzzzzzz');

test(validateSemverDecrementMacro, '0.0.0-pre', 'major', null);
test(validateSemverDecrementMacro, '0.0.0-pre', 'premajor', null);
test(validateSemverDecrementMacro, '0.0.0-pre', 'minor', null);
test(validateSemverDecrementMacro, '0.0.0-pre', 'preminor', null);
test(validateSemverDecrementMacro, '0.0.0-pre', 'patch', null);
test(validateSemverDecrementMacro, '0.0.0-pre', 'prepatch', null);
test(validateSemverDecrementMacro, '0.0.0-pre', 'prerelease', '0.0.0-0');

test(validateSemverDecrementMacro, '17.3.9-0', 'prerelease', '17.3.8');
test(validateSemverDecrementMacro, '17.3.0-0', 'prerelease', '17.2.9999');
test(validateSemverDecrementMacro, '17.0.9-0', 'prerelease', '17.0.8');
test(validateSemverDecrementMacro, '17.0.0-0', 'prerelease', '16.9999.9999');
test(validateSemverDecrementMacro, '0.0.0-0', 'prerelease', null);
