# Vue Color Picker

A Vue color picker component based on the [Farbtastic jQuery Color Picker plug-in](http://acko.net/blog/farbtastic-jquery-color-picker-plug-in/).

![npm](https://img.shields.io/npm/v/vue-color-picker-wheel.svg)
![npm](https://img.shields.io/npm/dt/vue-color-picker-wheel.svg)
![GitHub](https://img.shields.io/github/license/stijlbreuk/vue-color-picker-wheel.svg)

# Installation

```
npm install --save vue-color-picker-wheel
```

# Usage

ES6 modules
```HTML
<template>
  <div>
    <ColorPicker :width="300" :height="300" :disabled="false" @colorChange="onColorChange"></ColorPicker>
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
const ColorPicker = require('sb-color-picker');
```

In a script tag, this loads the component using the global Vue instance.

```HTML
<script src="https://unpkg.com/sb-color-picker"></script>
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

```bash
# Serve with hot reload (default at localhost:8080)
vue serve --open src/color-picker.vue

# Build all variants
npm run bundle
```

# License
[MIT](https://github.com/stijlbreuk/vue-color-picker-wheel/blob/master/readme.md)