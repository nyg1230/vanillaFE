/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */

const canvas = util.DomUtil.createElement("canvas");
const ctx = canvas.getContext("2d");

const publicCanvas = util.DomUtil.createElement("canvas");
const publicCtx = publicCanvas.getContext("2d");

const CanvasUtil = {
    line(coordinateList = [], type = "stroke") {
        return {
            coordinateList,
            type,
            draw: function(ctx) {
                const { coordinateList, type } = { ...this };
                if (util.CommonUtil.length(coordinateList) < 1) return;

                const [first, ...remain] = [...coordinateList];
                const [fx, fy, fStyles] = [...first];
                ctx.save();

                ctx.beginPath();
                CanvasUtil.setStyle(ctx, fStyles);
                ctx.moveTo(fx, fy);

                remain.forEach((coor) => {
                    const [x, y, styles] = [...coor];
                    CanvasUtil.setStyle(ctx, styles);
                    ctx.lineTo(x, y);
                });
                ctx.closePath();
                
                type === "stroke" ? ctx.stroke() : ctx.fill();
                ctx.restore();
            }
        }
    },
    rect(x, y, width, height, param) {
        const { type = "fill", style, option } = { ...param };
        return {
            x,
            y,
            width,
            height,
            type,
            style,
            option,
            draw: function(ctx, ratio = 1, addStyles = {}) {
                const { x, y: _y, width, height: _height, style } = { ...this };
                const fn = type === "fill" ? ctx.fillRect : ctx.strokeRect;
                ctx.save();

                CanvasUtil.setStyle(ctx, style);
                const height = _height * ratio;
                y = _y + _height - height
                fn.call(ctx, x, y, width, height);

                ctx.restore();
            }
        }
    },
    arc(x, y, r, startAngle, endAngle, param) {
        const { type = "fill", style, option } = { ...param };
        return {
            x,
            y,
            r,
            startAngle,
            endAngle,
            type,
            style,
            draw: function(ctx, ratio = 1, addParam) {
                const { x, y, r, startAngle, endAngle, type, style } = { ...this };
                const { style: addStyle, option: addOption } = { ...addParam };
                const fn = type !== "fill" ? ctx.stroke : ctx.fill;
                const gap = endAngle - startAngle;
                const mewgeStyle = util.CommonUtil.shallowMerge(style, addStyle);

                ctx.save();
                CanvasUtil.setStyle(ctx, mewgeStyle);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, r, startAngle, startAngle + gap * ratio);
                fn.call(ctx);
                ctx.closePath();

                ctx.restore();
            }
        };
    },
    circle(x, y, r, param) {
        return CanvasUtil.arc(x, y, r, 0, Math.PI * 2, param);
    },
    text(x, y, str, param) {
        const { type = "fill", style, option } = { ...param };
        return {
            x,
            y,
            type,
            text: str,
            style,
            option,
            getSize: function(ctx, isTransection = false) {
                isTransection === true && ctx.save();
                const mtx = ctx.measureText(this.text);
                const { width, actualBoundingBoxAscent: ba, actualBoundingBoxDescent: bd } = mtx;
                isTransection === true && ctx.restore();
                return {
                    width,
                    height: ba + bd
                };
            },
            draw: function(ctx, param) {
                const { style: addStyle, option: addOption } = { ...param };
                let { x, y, text, style, option } = { ...this };
                option = { ...option, ...addOption };
                const { rotate, position = "lc" } = { ...option };
                const fn = type !== "fill" ? ctx.strokeText : ctx.fillText;

                ctx.save();
                const [horison = "c", vertical = "c"] = [...position];
                
                let baseline;
                if (vertical === "t") {
                    baseline = "bottom";
                } else if (vertical === "b") {
                    baseline = "top";
                } else {
                    baseline = "middle";
                }

                if (rotate) {
                    const radian = rotate / 180 * Math.PI;
                    ctx.translate(x, y);
                    ctx.rotate(radian);
                    ctx.translate(-x, -y);
                }
                CanvasUtil.setStyle(ctx, { ...style, ...addStyle, textBaseline: baseline });
                const size = this.getSize(ctx);
                const { width } = { ...size };

                if (horison === "l") {
                    x -= width;
                } else if (horison === "c") {
                    x -= width / 2;
                }

                fn.call(ctx, text, x, y);

                ctx.restore();
            }
        }
    },
    getTextSize(text, style = {}) {
        publicCtx.save();
        this.setStyle(publicCtx, style);
        const mtx = publicCtx.measureText(text);
        const { width, actualBoundingBoxAscent: ba, actualBoundingBoxDescent: bd } = mtx;
        publicCtx.restore();
        return {
            width,
            height: ba + bd
        };
    },
    setStyle(ctx, styles) {
        if (util.CommonUtil.isObject(styles)) {
            Object.entries(styles).forEach(([k, v]) => {
                ctx[k] = v;
            });
        }
    },
    getTextSize(text, styles) {
        ctx.save();
        CanvasUtil.setStyle(ctx, styles);
        const mtx = ctx.measureText(text);
        const { width, actualBoundingBoxAscent: ba, actualBoundingBoxDescent: bd } = mtx;
        ctx.restore();
        return {
            width,
            height: ba + bd
        };
    },
    rotate(x, y, angle, obj) {},
    clear(canvas) {
        const canvasRect = util.StyleUtil.getBoundingClientRect(canvas);
		const { width, height } = canvasRect;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, width, height);        
    }
}


class CanvasBuilder {
    #container;
    #canvas;
    #ctx;

    constructor(target, options) {
        this.#container = target;
        this.#canvas = document.createElement("canvas");
        this.#ctx = this.#canvas.getContext("2d");

        const { attr } = { ...options };
        if (attr) {
            Object.entries(attr).forEach(([k, v]) => {
                this.#canvas.setAttribute(k, v);
            })
        }

        this.#container.appendChild(this.#canvas);
    }

    get canvas() {
        return this.#canvas;
    }

    get ctx() {
        return this.#ctx;
    }

    lines(pointList = [], type = "stroke", options = {}) {
        this.#ctx.save();
        const [first, ...list] = [...pointList];

        const [x1, y1, option] = [...first];

        this.#ctx.beginPath();
        this.setContext(option || options);
        this.#ctx.moveTo(x1, y1);

        list.forEach((p) => {
            const [x, y, opt] = [...p];
            this.setContext(opt || options);
            this.#ctx.lineTo(x, y);
        });
        this.#ctx.closePath();

        type === "stroke" ? this.#ctx.stroke() : this.#ctx.fill();
        this.#ctx.restore();
    }

    rect(point, width, height, type = "fill", option) {
        this.#ctx.save();
        this.setContext(option);
        const fn = type !== "fill" ? this.#ctx.strokeRect : this.#ctx.fillRect;
        fn.call(this.#ctx, ...point, width, height);
        this.#ctx.restore();
    }

    circle(point, size, type, options) {
        this.arc(point, size, [0, Math.PI], type, options);
    }

    arc(point, size, angle, type, options) {
        this.#ctx.save();
        const [x, y] = [...point];
        const [st, ed] = [...angle];
        
        this.#ctx.beginPath();
        this.setContext(options);
        this.#ctx.moveTo(x, y);
        this.#ctx.arc(x, y, size, st, ed);
        type !== "fill" ? this.#ctx.stroke() : this.#ctx.fill();
        this.#ctx.closePath();
        this.#ctx.restore();
    }

    text(text, point, type = "fill", options) {
        this.#ctx.save();
        this.setContext(options);
        const fn = type !== "stroke" ? this.#ctx.fillText : this.#ctx.strokeText;
        fn.call(this.#ctx, text, ...point);
        this.#ctx.restore();
    }

    setContext(option = {}) {
        const { style = {} , setting = [] } = { ...option };

        Object.entries(style).forEach(([k, v]) => {
            this.#ctx[k] = v;
        });

        setting.forEach((s) => {
            const { prop, value } = { ...s };
            this.#ctx[prop].apply(this.#ctx, value);
        });
    }

	getTextSize(text, option) {
		const textMatrics = this.#ctx.measureText(text);
		const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = textMatrics;
		return {
			width: width,
			height: actualBoundingBoxAscent + actualBoundingBoxDescent
		}
	}

    clear() {
        const canvasRect = util.StyleUtil.getBoundingClientRect(this.#canvas);
		const { width, height } = canvasRect;
        this.#ctx.clearRect(0, 0, width, height);
    }
}

const figure = {
    square: (x, y, width, height, type) => {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            draw: function(ctx) {
                ctx.beginPath();

                let fn;

                if (type === "fill") fn = ctx.fillRect.bind(ctx);
                else if (type === "clear") fn = ctx.clearRect.bind(ctx);
                else fn = ctx.strokeRect.bind(ctx);

                fn(this.x, this.y, this.width, this.height);
            }
        }
    },
    circle: (x, y, radius, stAngle, edAngle, type) => {
        return {
            x: x,
            y: y,
            radius: radius,
            stAngle: stAngle,
            edAngle: edAngle,
            draw: function(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, this.stAngle, this.edAngle);

                const fn = (type !== "fill") ? ctx.stroke.bind(ctx) : ctx.fill.bind(ctx);
                ctx.closePath();

                fn();
            }
        }
    }
}

// export default {
//     init: (target, options) => {
//         return new CanvasBuilder(target, options);;
//     }
// };

export default CanvasUtil;