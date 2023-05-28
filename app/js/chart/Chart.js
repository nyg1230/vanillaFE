import CanvasUtil from "../util/CanvasUtil.js";

class Chart {
    #container;
    #canvas;
    #data;
    #isDraw = false;

    constructor(target, data, options) {
        this.#container = target;
        this.#canvas = CanvasUtil.init(this.#container);
        this.#data = data;
        this.init();
    }

    get container() {
        return this.#container;
    }

    init() {
        this.#data && this.draw();
    }

    setChartData(data) {
        this.#data = data;
        const fn = (this.#isDraw === true) ? this.refresh.bind(this) : this.draw.bind(this);
        this.#isDraw = false;
        fn.then(() => (this.#isDraw = true));
    }

    // abstract
    async draw() {}

    async refresh() {
        await this.clear();
        await this.draw();
    }

    async clear() {
        this.#canvas.clear();
    }
}

export default Chart;