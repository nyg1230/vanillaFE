import CanvasUtil from "../util/CanvasUtil.js";
import * as util from "../util/Utils.js";

class Chart {
    #container;
    #builder;
    #data;
    #chartData;
    #isDraw = false;
    #tooltip;
    #observer;

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

    get #observerConfig() {
        return {
            attributeFilter: ["width", "height"]
        };
    }

    init() {
        this.#data && this.#draw();
        this.#addObserver();
    }

    #addObserver() {
        if (this.#observer) return;

        const callback = (ml) => {
            for (const m of ml) {
                const { type, attributeName } = m;

                if (type === "attributes") {
                    if (this.#observerConfig.attributeFilter.includes(attributeName)) {
                        this.refresh();
                    }
                }
            }
        }

        this.#observer = new MutationObserver(callback);
        this.#observer.observe(this.#builder.canvas, this.#observerConfig);
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
        this.#tooltip = util.TooltipUtil.setTooltip(canvas, this.#setTooltipContent.bind(this));
    }

    // interface
    setTooltipContent() {}
    #setTooltipContent(e) {
        return this.setTooltipContent.call(this, e, ...this.#getXY(e));
    }

    #getXY(e) {
        const rect = this.#builder.canvas.getBoundingClientRect();
        const { left, top } = rect;
        const { clientX, clientY } = e;
        const x = clientX - left;
        const y = clientY - top;

        return [x, y];
    }

    refresh() {
        this.clear();
        this.#draw();
    }

    clear() {
        this.#builder.clear();
    }
}

export default Chart;