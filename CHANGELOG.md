# Changelog
All changes to Vue Color Picker Wheel will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 15-11-2018
### Fixed
- Misalign issues when using CSS rules like 'text-align: center' or 'margin: 0 auto' on the parent element of the color picker

### Deprecations
- Using the 'colorChange' event is deprecated, will be removed in 1.0.0. Use 'v-model' or the 'color-change' instead.

## [0.3.0] - 15-11-2018
### Added
- v-model support