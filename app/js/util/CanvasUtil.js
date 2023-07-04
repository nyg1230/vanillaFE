import * as util from "../util/Utils.js";

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

export default {
    init: (target, options) => {
        return new CanvasBuilder(target, options);;
    }
};