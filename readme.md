# Vue Color Picker

A Vue color picker component based on the Farbtastic jQuery Color Picker plug-in.

# Installation

```
npm install --save sb-color-picker
```

# Usage

ES6 modules
```HTML
<template>
  <div>
    <ColorPicker :width="300" :height="300" :disabled="false"></ColorPicker>
  </div>
</template>

<script>
import ColorPicker from 'sb-color-picker';

export default {
  name: 'app',
  components: {
    ColorPicker
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

# Props
| Property   | Description                                             | Type                    | Default | Example              |
| ---------- | ------------------------------------------------------- | ----------------------- | ------- | -------------------- |
| width      | The width of the color picker                           | Number                  | 300     | :width="400"         |
| height     | The height of the color picker                          | Number                  | 300     | :height="400"        |
| disabled   | Whether or not the color picker should be disabled      | Boolean                 | false   | :disabled="false"    |
| startColor | The color that is selected when opening the colorpicker | String (hex color code) | none    | startColor="#ffffff" |

# Contributing

```bash
# Serve with hot reload (default at localhost:8080)
vue serve --open src/color-picker.vue

# Build all variants
npm run bundle
```
