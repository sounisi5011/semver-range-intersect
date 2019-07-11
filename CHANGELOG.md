# Change Log

## [0.x]

### Updated Dependencies

#### devDependencies

* `lint-staged`
    * [#24] - `9.1.0` -> `9.2.0`

### Added Dependencies

#### devDependencies

* [#28] - `github:sounisi5011/check-peer-deps`

### Tests

* [#28] - Check peerDependencies

[0.x]: https://github.com/sounisi5011/semver-range-intersect/compare/v0.2.0...HEAD
[#24]: https://github.com/sounisi5011/semver-range-intersect/pull/24
[#28]: https://github.com/sounisi5011/semver-range-intersect/pull/28

## [0.2.0] (2019-07-10)

### Bug Fixes

* [#13] - `intersect()` returns `'*'` instead of empty string
* [#14] - `intersect()` returns trimmed version range value
* [#15] - `intersect()` derive an appropriate intersection from the range that any version satisfies
* [#19] - `intersect()` normalize overlapping version ranges into one version range
* [#21] - `intersect()` returns null for a single non-intersecting version range

### Updated Dependencies

#### devDependencies

* `@types/node`
    * [#20] - `12.6.1` -> `12.6.2`
* `typescript`
    * [#10] - `3.5.2` -> `3.5.3`

### Added Dependencies

#### devDependencies

* [#22] - `fast-deep-equal@2.0.1`
* [#22] - `iter-tools@6.2.5`

### Tests

* [#22] - Test enhancements

[#10]: https://github.com/sounisi5011/semver-range-intersect/pull/10
[#13]: https://github.com/sounisi5011/semver-range-intersect/pull/13
[#14]: https://github.com/sounisi5011/semver-range-intersect/pull/14
[#15]: https://github.com/sounisi5011/semver-range-intersect/pull/15
[#19]: https://github.com/sounisi5011/semver-range-intersect/pull/19
[#20]: https://github.com/sounisi5011/semver-range-intersect/pull/20
[#21]: https://github.com/sounisi5011/semver-range-intersect/pull/21
[#22]: https://github.com/sounisi5011/semver-range-intersect/pull/22
[0.2.0]: https://github.com/sounisi5011/semver-range-intersect/compare/v0.1.0...v0.2.0

## [0.1.0] (2019-07-08 UTC / 2019-07-09 JST)

[0.1.0]: https://github.com/sounisi5011/semver-range-intersect/compare/v0.0.0...v0.1.0
