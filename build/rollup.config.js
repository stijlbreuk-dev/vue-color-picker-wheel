import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import { uglify } from "rollup-plugin-uglify";
import Autoprefixer from 'autoprefixer';

export default {
    input: 'src/wrapper.js', // Path relative to package.json
    output: {
        name: 'ColorPicker',
        exports: 'named',
    },
    plugins: [
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
            style: {
                postcssPlugins: [Autoprefixer()]
            }
            // Use style: 'scss' ? https://rollup-plugin-vue.vuejs.org/options.html#defaultlang
        }),
        buble(), // Transpile to ES5
        process.env.SB_MINIFY ? uglify() : undefined,
    ],
};