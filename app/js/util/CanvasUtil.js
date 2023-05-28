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

    get ctx() {
        return this.#ctx;
    }

    drawLine(pointList = [], type = "stroke", options = {}) {
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

    drawCircle(point, size, type, options) {
        const [x, y] = [...point];

        this.#ctx.beginPath();
        this.#ctx.arc(x, y, size, 0, Math.PI * 2);
        this.#ctx.closePath();
        
        type !== "fill" ? this.#ctx.stroke() : this.#ctx.fill();
    }

    setCtxStyle(option) {
        Object.entries(option).forEach(([k, v]) => {
            this.#ctx[k] = v;
        });
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
        const canvas = new CanvasBuilder(target, options);
        return canvas;
    }
};