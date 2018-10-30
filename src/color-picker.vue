<template>
    <div ref="container">
        <!-- <input id="color-input" type="text" v-model="color"></input> -->
        <div :class="{s_disabled: disabled}"
             ref="color-wheel"
             id="color-wheel"
             style="position: relative">
            <div class="farbtastic"
                 style="position: relative"
                 :style="{width, height}"
                 :width="width"
                 :height="height">
                <div ref="farbtastic-solid"
                     class="farbtastic-solid"
                     :style="solidStyle"
                     :width="width"
                     :height="height"
                     style="position: absolute"></div>
                <canvas ref="farbtastic-mask"
                        class="farbtastic-mask"
                        :style="{width, height}"
                        :width="width"
                        :height="height"
                        style="position: absolute"></canvas>
                <canvas @mousedown="mousedown"
                        @touchstart="touchHandleStart"
                        @touchmove="touchHandleMove"
                        @touchend="touchHandleEnd"
                        ref="farbtastic-overlay"
                        class="farbtastic-overlay"
                        :style="{width, height}"
                        :width="width"
                        :height="height"
                        style="position: absolute"></canvas>
            </div>
        </div>
    </div>
</template>
<script>
import isIE from './util/is-ie.js';

const DEFAULT_WIDTH_HEIGHT = 300;

export default {
    name: 'color-picker',
    props: {
        width: {
            required: false,
            type: Number,
            default: DEFAULT_WIDTH_HEIGHT
        },
        height: {
            required: false,
            type: Number,
            default: DEFAULT_WIDTH_HEIGHT
        },
        disabled: {
            required: false,
            type: Boolean,
            default: false
        },
        startColor: {
            required: false,
            type: String
        }
    },
    mounted() {
        this.initWidget();
        if (this.startColor) {
            this.setColor(this.startColor);
        }
        if (!this.color) this.setColor('#808080');
    },
    data() {
        return {
            debug: false,
            dragging: false,
            circleDrag: false,
            value: '',
            color: '',
            rgb: '',
            hsl: '',
            radius: '',
            square: '',
            mid: '',
            markerSize: '',
            ctxMask: '',
            ctxOverlay: '',
            cnvMask: '',
            cnvOverlay: '',
            offset: {
                left: '',
                top: ''
            }
        };
    },
    computed: {
        solidStyle() {
            return {
                'background-color': this.pack(this.HSLToRGB([this.hsl[0], 1, 0.5])),
                width: `${this.square * 2 - 1}px`,
                height: `${this.square * 2 - 1}px`,
                left: `${this.mid - this.square}px`,
                top: `${this.mid - this.square}px`
            };
        },
        wheelWidth() {
            return (this.width || 300) / 10;
        }
    },
    methods: {
        updateValue() {
            if (this.value && this.value !== this.color) {
                this.setColor(this.value);
            }
        },
        setColor(color, noEmit = false) {
            const unpack = this.unpack(color);
            if (this.color !== color && unpack) {
                this.color = color;
                this.rgb = unpack;
                this.hsl = this.RGBToHSL(this.rgb);
                this.updateDisplay(noEmit);
            }
            return this;
        },
        setHSL(hsl) {
            this.hsl = hsl;
            this.rgb = this.HSLToRGB(hsl);
            this.color = this.pack(this.rgb);
            this.updateDisplay();
            return this;
        },
        initWidget() {
            // Determine layout
            this.radius = (this.width - this.wheelWidth) / 2 - 1;
            this.square = Math.floor((this.radius - this.wheelWidth / 2) * 0.7) - 1;
            this.mid = Math.floor(this.width / 2);
            this.markerSize = this.wheelWidth * 0.3;

            // Set up drawing context.
            this.cnvMask = this.$refs['farbtastic-mask'];
            this.ctxMask = this.cnvMask.getContext('2d');
            this.cnvOverlay = this.$refs['farbtastic-overlay'];
            this.ctxOverlay = this.cnvOverlay.getContext('2d');
            this.devicePixelRatio = window.devicePixelRatio || 1;
            this.upscaleCanvas(this.cnvMask);
            this.upscaleCanvas(this.cnvOverlay);
            this.ctxMask.translate(this.mid, this.mid);
            this.ctxOverlay.translate(this.mid, this.mid);

            // Draw widget base layers.
            this.drawCircle();
            this.drawMask();
        },
        upscaleCanvas(cnv) {
            const ctx = cnv.getContext('2d');
            const backingStoreRatio =
                ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio ||
                1;
            if (this.devicePixelRatio !== backingStoreRatio) {
                const ratio = this.devicePixelRatio / backingStoreRatio;

                const oldWidth = cnv.width;
                const oldHeight = cnv.height;
                cnv.width = oldWidth * ratio;
                cnv.height = oldHeight * ratio;
                cnv.style.width = `${oldWidth}px`;
                cnv.style.height = `${oldHeight}px`;
                ctx.scale(ratio, ratio);
            }
        },
        drawCircle() {            ``
            const tm = +(new Date());
            // Draw a hue circle with a bunch of gradient-stroked beziers.
            // Have to use beziers, as gradient-stroked arcs don't work.
            const n = 24;
            const r = this.radius;
            const w = this.wheelWidth;
            const nudge = (8 / r / n) * Math.PI; // Fudge factor for seams.
            const m = this.ctxMask;
            let angle1 = 0;
            let angle2;
            let d1;
            let color1;
            let color2;
            m.save();
            m.lineWidth = w / r;
            m.scale(r, r);
            // Each segment goes from angle1 to angle2.
            // eslint-disable-next-line
            for (let i = 0; i <= n; ++i) {
                const d2 = i / n;
                angle2 = d2 * Math.PI * 2;
                // Endpoints
                const x1 = Math.sin(angle1);
                const y1 = -Math.cos(angle1);
                const x2 = Math.sin(angle2);
                const y2 = -Math.cos(angle2);
                // Midpoint chosen so that the endpoints are tangent to the circle.
                const am = (angle1 + angle2) / 2;
                const tan = 1 / Math.cos((angle2 - angle1) / 2);
                const xm = Math.sin(am) * tan;
                const ym = -Math.cos(am) * tan;
                // New color
                color2 = this.pack(this.HSLToRGB([d2, 1, 0.5]));
                if (i > 0) {
                    // Create gradient fill between the endpoints.
                    const grad = m.createLinearGradient(x1, y1, x2, y2);
                    grad.addColorStop(0, color1);
                    grad.addColorStop(1, color2);
                    m.strokeStyle = grad;
                    // Draw quadratic curve segment.
                    m.beginPath();
                    m.moveTo(x1, y1);
                    m.quadraticCurveTo(xm, ym, x2, y2);
                    m.stroke();
                }
                // Prevent seams where curves join.
                angle1 = angle2 - nudge;
                color1 = color2;
                d1 = d2;
            }
            m.restore();
            if (this.debug) {
                const debugElement = document.createElement('div');
                debugElement.textContent = `drawCircle ${(+(new Date()) - tm)} ms`;
                document.body.appendChild(debugElement);
            }
        },
        drawMask() {
            const tm = +(new Date());

            // Iterate over sat/lum space and calculate appropriate mask pixel values.
            const size = this.square * 2;
            const sq = this.square;
            function calculateMask(sizex, sizey, outputPixel) {
                const isx = 1 / sizex;
                const isy = 1 / sizey;
                // eslint-disable-next-line
                for (let y = 0; y <= sizey; ++y) {
                    const l = 1 - y * isy;
                    // eslint-disable-next-line
                    for (let x = 0; x <= sizex; ++x) {
                        const s = 1 - x * isx;
                        // From sat/lum to alpha and color (grayscale)
                        const a = 1 - 2 * Math.min(l * s, (1 - l) * s);
                        const c = a > 0 ? (2 * l - 1 + a) * (0.5 / a) : 0;
                        outputPixel(x, y, c, a);
                    }
                }
            }

            // Method #1: direct pixel access (new Canvas).
            if (this.ctxMask.getImageData) {
                // Create half-resolution buffer.
                const sz = Math.floor(size / 2);
                const buffer = document.createElement('canvas');
                buffer.width = sz + 1;
                buffer.height = sz + 1;
                const ctx = buffer.getContext('2d');
                const frame = ctx.getImageData(0, 0, sz + 1, sz + 1);

                let i = 0;
                calculateMask(sz, sz, (x, y, c, a) => {
                    // eslint-disable-next-line
                    frame.data[i++] = frame.data[i++] = frame.data[i++] = c * 255;
                    // eslint-disable-next-line
                    frame.data[i++] = a * 255;
                });

                ctx.putImageData(frame, 0, 0);
                this.ctxMask.drawImage(
                    buffer,
                    0,
                    0,
                    sz + 1,
                    sz + 1,
                    -sq,
                    -sq,
                    sq * 2,
                    sq * 2
                );
            } else if (!isIE()) {
                // Render directly at half-resolution
                const sz = Math.floor(size / 2);
                calculateMask(sz, sz, (x, y, _c, a) => {
                    const c = Math.round(_c * 255);
                    this.ctxMask.fillStyle = `rgba(${c}, ${c}, ${c}, ${a})`;
                    this.ctxMask.fillRect(x * 2 - sq - 1, y * 2 - sq - 1, 2, 2);
                });
            } else {
                let cacheLast;
                let cache;
                const w = 6; // Each strip is 6 pixels wide.
                const sizex = Math.floor(size / w);
                // 6 vertical pieces of gradient per strip.
                calculateMask(sizex, 6, (x, y, c, a) => {
                    if (x === 0) {
                        cacheLast = cache;
                        cache = [];
                    }
                    c = Math.round(c * 255);
                    a = Math.round(a * 255);
                    // We can only start outputting gradients
                    // once we have two rows of pixels.
                    if (y > 0) {
                        const cLast = cacheLast[x][0];
                        const aLast = cacheLast[x][1];
                        const color1 = this.packDX(cLast, aLast);
                        const color2 = this.packDX(c, a);
                        const y1 = Math.round(this.mid + ((y - 1) * 0.333 - 1) * sq);
                        const y2 = Math.round(this.mid + (y * 0.333 - 1) * sq);
                        // Append div to canvasMask
                        const div = document.createElement('div');
                        div.style.position = 'absolute'
                        div.style.filter = `progid:DXImageTransform.Microsoft.Gradient(StartColorStr=${color1}, EndColorStr=${color2}, GradientType=0)`;
                        div.style.top = y1;
                        div.style.height = y2 - y1;
                        div.style.left = this.mid + (x * w - sq - 1);
                        div.style.width = this.mid + (x * w - sq - 1);
                        this.cnvMask.appendChild(div)
                    }
                    cache.push([c, a]);
                });
            }
            if (this.debug) {
                const debugElement = document.createElement('div');
                debugElement.textContent = `drawMask ${(+(new Date()) - tm)} ms`;
                document.body.appendChild(debugElement);
            }
        },
        drawMarkers() {
            // Determine marker dimensions
            const sz = this.width;
            const lw = Math.ceil(this.markerSize / 4);
            const r = this.markerSize - lw + 1;
            const angle = this.hsl[0] * 6.28;
            const x1 = Math.sin(angle) * this.radius;
            const y1 = -Math.cos(angle) * this.radius;
            const x2 = 2 * this.square * (0.5 - this.hsl[1]);
            const y2 = 2 * this.square * (0.5 - this.hsl[2]);
            const c1 = this.invert ? '#fff' : '#000';
            const c2 = this.invert ? '#000' : '#fff';
            const circles = [
                { x: x1, y: y1, r, c: '#000', lw: lw + 1 },
                { x: x1, y: y1, r: this.markerSize, c: '#fff', lw },
                { x: x2, y: y2, r, c: c2, lw: lw + 1 },
                { x: x2, y: y2, r: this.markerSize, c: c1, lw }
            ];

            // Update the overlay canvas.
            this.ctxOverlay.clearRect(-this.mid, -this.mid, sz, sz);
            for (let i = 0; i < circles.length; i += 1) {
                const c = circles[i];
                this.ctxOverlay.lineWidth = c.lw;
                this.ctxOverlay.strokeStyle = c.c;
                this.ctxOverlay.beginPath();
                this.ctxOverlay.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
                this.ctxOverlay.stroke();
            }
        },
        updateDisplay(noEmit) {
            // Determine whether labels/markers should invert.
            this.invert =
                this.rgb[0] * 0.3 + this.rgb[1] * 0.59 + this.rgb[2] * 0.11 <= 0.6;

            // Draw markers
            this.drawMarkers();

            if (!noEmit) {
                // Emit color
                this.$emit('colorChange', this.color);
            }
        },
        widgetCoords(event) {
            return {
                x: event.pageX - this.offset.left - this.mid,
                y: event.pageY - this.offset.top - this.mid
            };
        },
        mousedown(event) {
            if (this.disabled) return false;
            // Capture mouse
            if (!this.dragging) {
                document.addEventListener('mousemove', this.mousemove);
                document.addEventListener('mouseup', this.mouseup);
                this.dragging = true;
            }

            // Update the stored offset for the widget.
            this.offset = {
                left: this.$refs['color-wheel'].getBoundingClientRect().left,
                top: this.$refs['color-wheel'].getBoundingClientRect().top
            };

            // Check which area is being dragged
            const pos = this.widgetCoords(event);
            this.circleDrag =
                Math.max(Math.abs(pos.x), Math.abs(pos.y)) > this.square + 2;

            // Process
            this.mousemove(event);
            return false;
        },
        mousemove(event) {
            // Get coordinates relative to color picker center
            const pos = this.widgetCoords(event);

            // Set new HSL parameters
            if (this.circleDrag) {
                const hue = Math.atan2(pos.x, -pos.y) / 6.28;
                this.setHSL([(hue + 1) % 1, this.hsl[1], this.hsl[2]]);
            } else {
                const sat = Math.max(0, Math.min(1, -(pos.x / this.square / 2) + 0.5));
                const lum = Math.max(0, Math.min(1, -(pos.y / this.square / 2) + 0.5));
                this.setHSL([this.hsl[0], sat, lum]);
            }
            return false;
        },
        mouseup() {
            // Uncapture mouse
            document.removeEventListener('mousemove', this.mousemove);
            document.removeEventListener('mouseup', this.mouseup);
            this.dragging = false;
        },
        /* Constious color utility functions */
        dec2hex(x) {
            return (x < 16 ? '0' : '') + x.toString(16);
        },
        packDX(c, a) {
            return `#${this.dec2hex(a) +
                this.dec2hex(c) +
                this.dec2hex(c) +
                this.dec2hex(c)}`;
        },
        pack(rgb) {
            const r = Math.round(rgb[0] * 255);
            const g = Math.round(rgb[1] * 255);
            const b = Math.round(rgb[2] * 255);
            return `#${this.dec2hex(r) + this.dec2hex(g) + this.dec2hex(b)}`;
        },
        unpack(color) {
            if (color.length === 7) {
                return [1, 3, 5].map(
                    i => parseInt(color.substring(i, i + 2), 16) / 255
                );
            } else if (color.length === 4) {
                return [1, 2, 3].map(i => parseInt(color.substring(i, i + 1), 16) / 15);
            }
            return false;
        },
        HSLToRGB(hsl) {
            const h = hsl[0];
            const s = hsl[1];
            const l = hsl[2];
            const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
            const m1 = l * 2 - m2;
            return [
                this.hueToRGB(m1, m2, h + 0.33333),
                this.hueToRGB(m1, m2, h),
                this.hueToRGB(m1, m2, h - 0.33333)
            ];
        },
        hueToRGB(m1, m2, h) {
            h = (h + 1) % 1;
            if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
            if (h * 2 < 1) return m2;
            if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
            return m1;
        },
        RGBToHSL(rgb) {
            const r = rgb[0];
            const g = rgb[1];
            const b = rgb[2];
            const min = Math.min(r, g, b);
            const max = Math.max(r, g, b);
            const delta = max - min;
            let h = 0;
            let s = 0;
            const l = (min + max) / 2;
            if (l > 0 && l < 1) {
                s = delta / (l < 0.5 ? 2 * l : 2 - 2 * l);
            }
            if (delta > 0) {
                if (max === r && max !== g) h += (g - b) / delta;
                if (max === g && max !== b) h += 2 + (b - r) / delta;
                if (max === b && max !== r) h += 4 + (r - g) / delta;
                h /= 6;
            }
            return [h, s, l];
        },
        /**
         * Helper for returning coordinates relative to the center with touch event
         */
        widgetCoordsTouch(event) {
            return {
                x: event.targetTouches[0].pageX - this.offset.left - this.mid,
                y: event.targetTouches[0].pageY - this.offset.top - this.mid
            };
        },
        /**
         * Handle the touchstart events
         */
        touchHandleStart(event) {
            // Ignore the event if another is already being handled
            if (this.touchHandled) {
                return;
            }

            // Set the flag to prevent others from inheriting the touch event
            this.touchHandled = true;

            // Track movement to determine if interaction was a click
            this._touchMoved = false;

            // Update the stored offset for the widget.
            this.offset = {
                left: this.$refs['color-wheel'].getBoundingClientRect().left,
                top: this.$refs['color-wheel'].getBoundingClientRect().top
            };

            // Check which area is being dragged
            const pos = this.widgetCoordsTouch(event);
            this.circleDrag =
                Math.max(Math.abs(pos.x), Math.abs(pos.y)) > this.square + 2;
        },
        /**
         * Handle the touchstart events
         */
        touchHandleMove(event) {
            // Ignore event if not handled
            if (!this.touchHandled) {
                return;
            }
            event.preventDefault();

            // Interaction was not a click
            this._touchMoved = true;

            // Get coordinates relative to color picker center
            const pos = this.widgetCoordsTouch(event);

            // Set new HSL parameters
            if (this.circleDrag) {
                const hue = Math.atan2(pos.x, -pos.y) / 6.28;
                this.setHSL([(hue + 1) % 1, this.hsl[1], this.hsl[2]]);
            } else {
                const sat = Math.max(0, Math.min(1, -(pos.x / this.square / 2) + 0.5));
                const lum = Math.max(0, Math.min(1, -(pos.y / this.square / 2) + 0.5));
                this.setHSL([this.hsl[0], sat, lum]);
            }
        },
        /**
         * Handle the touchstart events
         */
        touchHandleEnd() {
            // Ignore event if not handled
            if (!this.touchHandled) {
                return;
            }
            // Unset the flag to allow other widgets to inherit the touch event
            this.touchHandled = false;
        }
    }
};
</script>
<style scoped>
.s_disabled {
  opacity: 0.5;
}
</style>