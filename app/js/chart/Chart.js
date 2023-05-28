import CanvasUtil from "../util/CanvasUtil.js";

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

    parseChartData() {}

    #draw() {
        this.#isDraw = false;
        this.#chartData = this.parseChartData();
        this.draw();
        this.#isDraw = true;
    }

    // abstract
    draw() {}

    refresh() {
        this.clear();
        this.#draw();
    }

    clear() {
        this.#builder.clear();
    }
}

export default Chart;