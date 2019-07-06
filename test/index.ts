import test from 'ava';

import { intersect } from '../src';

test('intersect() returns string type value', t => {
    t.is(typeof intersect('1.0.0'), 'string');
});
