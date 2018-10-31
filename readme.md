# Vue Color Picker Wheel

<p align="center">
  <img src="https://raw.githubusercontent.com/stijlbreuk/vue-color-picker-wheel/master/examples/vue-color-picker-wheel-example.png" alt="Example"/>
</p>

<p align="center">

<a href="https://www.npmjs.com/package/vue-color-picker-wheel">
    <img src="https://img.shields.io/npm/v/vue-color-picker-wheel.svg" alt="Version"/>
</a>
<a href="https://www.npmjs.com/package/vue-color-picker-wheel">
    <img src="https://img.shields.io/npm/dt/vue-color-picker-wheel.svg" alt="Downloads"/>
</a>
<a href="https://www.npmjs.com/package/vue-color-picker-wheel">
    <img src="https://img.shields.io/npm/l/vue-color-picker-wheel.svg" alt="License"/>
</a>

</p>

<p align="center">
A Vue color picker component based on the <a href="http://acko.net/blog/farbtastic-jquery-color-picker-plug-in/">Farbtastic jQuery Color Picker plug-in</a>.
</p>

# Demo
## Basic
<a href="https://codepen.io/nino-vrijman/pen/ePaELe" target="_blank">Basic CodePen demo</a>

<a href="https://codesandbox.io/s/7j4po25ly1?module=%2Fsrc%2FApp.vue" target="_blank"><img src="https://codesandbox.io/static/img/play-codesandbox.svg"/></a>

# Installation

```
npm install --save vue-color-picker-wheel
```

# Usage

ES6 modules
```HTML
<template>
  <div>
    <ColorPicker :width="300" :height="300" :disabled="false" startColor="#ff0000" @colorChange="onColorChange"></ColorPicker>
  </div>
</template>

<script>
import ColorPicker from 'vue-color-picker-wheel';

export default {
  name: 'app',
  components: {
    ColorPicker
  },
  methods: {
    onColorChange(color) {
      console.log('Color has changed to: ', color);
    }
  }
};
</script>
```

CommonJS
```JavaScript
const ColorPicker = require('vue-color-picker-wheel');
```

In a script tag, this loads the component using the global Vue instance.

```HTML
<script src="https://unpkg.com/vue-color-picker-wheel"></script>
```

# Properties
| Property   | Description                                             | Type                    | Default | Example              |
| ---------- | ------------------------------------------------------- | ----------------------- | ------- | -------------------- |
| width      | The width of the color picker                           | Number                  | 300     | :width="400"         |
| height     | The height of the color picker                          | Number                  | 300     | :height="400"        |
| disabled   | Whether or not the color picker should be disabled      | Boolean                 | false   | :disabled="false"    |
| startColor | The color that is selected when opening the colorpicker | String (hex color code) | none    | startColor="#ffffff" |

# Events
| Event       | Description                                   | Event parameters               |
| ----------- | --------------------------------------------- | ------------------------------ |
| colorChange | Is fired after the selected color has changed | color: String (hex color code) |

# Contributing

Checkout [GitHub issues](https://github.com/stijlbreuk/vue-color-picker-wheel/issues) for any issues we need some help with.

```bash
# Serve with hot reload (default at localhost:8080)
vue serve --open src/color-picker.vue

# Build all variants
npm run bundle
```

# License
[MIT](https://github.com/stijlbreuk/vue-color-picker-wheel/blob/master/readme.md)