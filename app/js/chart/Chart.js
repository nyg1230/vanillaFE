import CanvasUtil from "../util/CanvasUtil.js";
import * as util from "../util/Utils.js";

class Chart {
    #container;
    #builder;
    #data;
    #chartData;
    #isDraw = false;
    #tooltip;
    #option;
    #commonOption;
    #observer;

    constructor(target, data, options) {
        this.#container = target;
        this.#builder = CanvasUtil.init(this.#container, options);
        this.#data = data;
        this.#init();
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

    #init() {
        this.#initOption();
        if (util.CommonUtil.isNotEmpty(this.#data)) {
            this.#parseOption();
            this.#parseChartData();
        }
        this.#addObserver();
    }

    // abstract
    initOption() {}
    #initOption() {
        const option = {
            animation: {
                type: "constant",
                speed: "normal"
            }
        };
        this.#commonOption = util.CommonUtil.shallowMerge(option, this.initOption());
    }

    // abstract
    parseOption() {}
    #parseOption(param) {
        if (util.CommonUtil.isNull(param)) {
            if (util.CommonUtil.isNull(this.#option)) {
                util.CommonUtil.shallowMerge(this.#commonOption, {});
            }
        } else {
            this.#option = util.CommonUtil.shallowMerge(this.#commonOption, this.parseOption(param));
        }
    }

    // abstract
    parseChartData() {}
    #parseChartData() {
        this.#chartData = this.parseChartData(this.#data, this.#option);
        this.#isDraw = false;
        this.#draw();
    }


    // abstract
    draw() {}
    #draw() {
        if (this.#draw !== true) {
            this.clear();
            this.draw(this.#chartData, this.#option);
            this.#setTooltip();
            this.#isDraw = true;
        }
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

    setChartData(param) {
        const { data, option } = { ...param };
        this.#data = data;
        this.#parseOption(option);
        this.#parseChartData();
    }

    #setTooltip() {
        const canvas = this.#builder.canvas;
        this.#tooltip = util.TooltipUtil.setTooltip(canvas, this.#setTooltipContent.bind(this));
    }

    // interface
    setTooltipContent() {}
    #setTooltipContent(e) {
        const content = this.setTooltipContent(e, ...this.#getXY(e));
        return content;
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
        this.#draw();
    }

    clear() {
        this.#builder.clear();
    }
}

export default Chart;