# semver-range-intersect

Get the intersection of multiple semver ranges.

## Install

```sh
npm install semver-range-intersect
```

## Usage

```js
const { intersect } = require('semver-range-intersect');

// equals to: '^4.1.0'
intersect('^4.0.0', '^4.1.0') === '>=4.1.0 <5.0.0'

// equals to: 1.1.0 - 1.4.0
intersect('1.1.0 - 1.2.3 || 1.2.0 - 1.4.0') === '>=1.1.0 <=1.4.0'

intersect('8.2.6 - 8.x.x', '<=8.6.9') === '>=8.2.6 <=8.6.9'

intersect('^6.0.0', '6.7.9') === '6.7.9'

// equals to: ^8.15.0 || ^10.13.0 || >=11.10.1
intersect('^8.15.0 || >=10.0.0', '^8.10.0 || ^10.13.0 || >=11.10.1') === '>=8.15.0 <9.0.0 || >=10.13.0 <11.0.0 || >=11.10.1 '

// null for invalid version
intersect('a.b.c') === null

// null for version range not crossing
intersect('^2.0.0', '^5.0.0') === null
intersect('8.2.6 - 8.x.x', '>=9.0.1') === null
```

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```sh
npm install
npm test
```

## Related

* [semver-intersect](https://github.com/snyamathi/semver-intersect)
