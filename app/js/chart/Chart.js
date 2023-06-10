import CanvasUtil from "../util/CanvasUtil.js";
import * as util from "../util/Utils.js";

class Chart {
    #container;
    #builder;
    #data;
    #chartData;
    #isDraw = false;

    constructor(target, data, options) {
        this.#container = target;
        this.#builder = CanvasUtil.init(this.#container, options);
        this.#data = data;
        this.init();
    }

    get container() {
        return this.#container;
    }

    get builder() {
        return this.#builder;
    }

    get data() {
        return this.#data;
    }

    get chartData() {
        return this.#chartData;
    }

    init() {
        this.#data && this.#draw();
    }

    setChartData(data) {
        this.#data = data;
        const fn = (this.#isDraw === true) ? this.refresh.bind(this) : this.#draw.bind(this);
        fn();
    }

    #draw() {
        this.#isDraw = false;
        this.#chartData = this.parseChartData();
        this.draw();
        this.#setTooltip();
        this.#isDraw = true;
    }

    // abstract
    parseChartData() {}

    // abstract
    draw() {}

    #setTooltip() {
        const canvas = this.#builder.canvas;

        const mouseEnter = (e) => {
            canvas.addEventListener("mousemove", mouseMove);
            canvas.addEventListener("mouseleave", mouseLeave);
        };

        const mouseMove = (e) => {
            const data = this.#getTooltipData(e);
            if (data) {
                console.log(data);
            }
        };

        const mouseLeave = (e) => {
            canvas.removeEventListener("mouseleave", mouseLeave);
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.addEventListener("mouseenter", mouseEnter);
        };

        canvas.addEventListener("mouseenter", mouseEnter);
    }

    #getTooltipData(e) {
        const rect = this.#builder.canvas.getBoundingClientRect();
        const { left, top } = rect;
        const { clientX, clientY } = e;
        const x = clientX - left;
        const y = clientY - top;
        return this.getTooltipData(x, y);
    }
    
    getTooltipData() {}

    gotTooltipHtml() {}

    refresh() {
        this.clear();
        this.#draw();
    }

    clear() {
        this.#builder.clear();
    }
}

export default Chart;