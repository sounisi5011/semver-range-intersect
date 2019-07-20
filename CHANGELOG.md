# Change Log

## [0.3.1] (2019-07-20 UTC / 2019-07-21 JST)

### Documentation

* [#39] - Add Type Definitions Badge

### Supported Node version

`8.12.0 - 8.x || 10.0.0 - x.x` -> `8.3.0 - x.x`

* [#40] - Downgrade supported Node version

### Updated Dependencies

#### devDependencies

* `eslint-plugin-import`
    * [#38] - `2.18.0` -> `2.18.2`
* `husky`
    * [#37] - `3.0.0` -> `3.0.1`

[0.3.1]: https://github.com/sounisi5011/semver-range-intersect/compare/v0.3.0...v0.3.1
[#37]: https://github.com/sounisi5011/semver-range-intersect/pull/37
[#38]: https://github.com/sounisi5011/semver-range-intersect/pull/38
[#39]: https://github.com/sounisi5011/semver-range-intersect/pull/39
[#40]: https://github.com/sounisi5011/semver-range-intersect/pull/40

## [0.3.0] (2019-07-15 UTC / 2019-07-16 JST)

### Bug Fixes

* [#32] - Ignore non-matching ranges delimited by `||`
* [#35] - Fixed prerelease version range processing logic

### Updated Dependencies

#### devDependencies

* `@typescript-eslint/eslint-plugin`
    * [#33] - `1.11.0` -> `1.12.0`
* `@typescript-eslint/parser`
    * [#33] - `1.11.0` -> `1.12.0`
* `lint-staged`
    * [#24] - `9.1.0` -> `9.2.0`

### Added Dependencies

#### devDependencies

* [#28] - `github:sounisi5011/check-peer-deps`
* [#31] - `package-version-git-tag@1.0.0`

### Removed Dependencies

#### devDependencies

* [#31] - `@types/node@12.6.2`

### Tests

* [#28] - Check peerDependencies
* [#34] - Verify test expected values

### Others

* [#31] - Replace build script `script/git-add-pkg-version-tag.ts` with package-version-git-tag package.

[0.3.0]: https://github.com/sounisi5011/semver-range-intersect/compare/v0.2.0...v0.3.0
[#24]: https://github.com/sounisi5011/semver-range-intersect/pull/24
[#28]: https://github.com/sounisi5011/semver-range-intersect/pull/28
[#31]: https://github.com/sounisi5011/semver-range-intersect/pull/31
[#32]: https://github.com/sounisi5011/semver-range-intersect/pull/32
[#33]: https://github.com/sounisi5011/semver-range-intersect/pull/33
[#34]: https://github.com/sounisi5011/semver-range-intersect/pull/34
[#35]: https://github.com/sounisi5011/semver-range-intersect/pull/35

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
