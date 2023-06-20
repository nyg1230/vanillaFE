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
		this.addEvent();
    }

	addEvent() {
		window.addEventListener("resize", this.onResize.bind(this));
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
        console.log("#setTooltip");
        util.TooltipUtil.setTooltip(canvas, this.#setTooltipContent.bind(this));
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

	onResize() {}
}

export default Chart;