<template>
    <div id="app">
        <h1>Vue Color Picker Wheel</h1>
        <p>A Vue color picker component based on the Farbtastic jQuery Color Picker plug-in.</p>
        <color-picker v-model="color"></color-picker>
        <p>
            Color:
            <input v-model="color" type="text">
        </p>
    </div>
</template>
<script>
    import ColorPicker from '../src/color-picker.vue';

    export default {
        name: 'App',
        components: {
            ColorPicker
        },
        created() {
        },
        data() {
            return {
                color: '#ff6600'
            };
        },
    };
</script>

<style lang="css">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
