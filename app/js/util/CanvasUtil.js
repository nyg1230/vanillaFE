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
        const [first, ...list] = [...pointList];

        const [x1, y1, option] = [...first];

        this.#ctx.beginPath();
        this.setCtxStyle(option || options);
        this.#ctx.moveTo(x1, y1);

        list.forEach((p) => {
            const [x, y, opt] = [...p];
            this.setCtxStyle(opt || options);
            this.#ctx.lineTo(x, y);
        });
        this.#ctx.closePath();

        type === "stroke" ? this.#ctx.stroke() : this.#ctx.fill();
    }

    circle(point, size, type, options) {
        this.arc(point, size, [0, Math.PI], type, options);
    }

    arc(point, size, angle, type, options) {
        const [x, y] = [...point];
        const [st, ed] = [...angle];
        
        this.#ctx.beginPath();
        this.setCtxStyle(options);
        this.#ctx.moveTo(x, y);
        this.#ctx.arc(x, y, size, st, ed);
        type !== "fill" ? this.#ctx.stroke() : this.#ctx.fill();
        this.#ctx.closePath();
    }

    text(text, point, type = "fill", options) {
        this.setCtxStyle(options);
        const fn = type !== "stroke" ? this.#ctx.fillText : this.#ctx.strokeText;
        fn.call(this.#ctx, text, ...point);
    }

    setCtxStyle(option = {}) {
        Object.entries(option).forEach(([k, v]) => {
            this.#ctx[k] = v;
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
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
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