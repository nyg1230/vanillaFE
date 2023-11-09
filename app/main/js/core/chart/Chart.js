/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import charts from "js/core/chart/charts.js";
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
/* option */
import CommonOption from "js/core/chart/option/CommonOption.js";

const axisChart = ["column", "line", "columnStack"];

class Chart {
    #data;
    #container;
    #charts = new Map();
    #area;
    #mainLayer;
    #overLayer;

    constructor(params) {
        const { container } = { ...params };
        this.#container = container;

        this.init();
    }

    get data() {
        return this.#data;
    }

    set data(d) {
        this.#data = util.CommonUtil.shallowMerge(d, CommonOption);
        console.log(this.#data);
        this.parseData();
    }

    init() {
        const rect = util.StyleUtil.getBoundingClientRect(this.#container);
        const { width, height } = rect;
        this.#mainLayer = util.DomUtil.createElement("canvas", { className: "main-layer", width, height });
        this.#overLayer = util.DomUtil.createElement("canvas", { className: "over-layer", width, height });

        this.#container.appendChild(this.#mainLayer);
        this.#container.appendChild(this.#overLayer);
    }

    parseData() {
        const { data = [] } = this.#data;

        data.forEach((d) => {
            const { type, list } = d;
            !this.#charts.has(type) && this.#charts.set(type, new charts[type]);

            const chart = this.#charts.get(type);
            chart.add(list);
        });

        this.calcArea();

        this.#charts.forEach((chart) => {
            chart.area = this.#area;
            chart.parse();
        });

        this.draw();
    }

    isAxis() {
        const { data = [] } = { ...this.#data };
        const result = data.some((d) => axisChart.includes(d.type));

        return result;
    }

    calcArea() {
        this.#area = { x: 0, y: 0, widht: 0, height: 0 };

        this.calcHeader();
        this.calcLegend();
        if (this.isAxis()) {
            this.calcAxis();
        }

        console.log(this.#area);
    }

    calcHeader() {
        const { header = {} } = this.data;
        const { title, style } = header;

        if (util.CommonUtil.isEmpty(title)) return;

        const titleSize = util.CanvasUtil.getTextSize(title, { style });
        const { width, height } = titleSize;
        console.log(titleSize);

        this.#area.y += (height + 1);
    }

    calcLegend() {}
    
    calcAxis() {}

    draw() {
        const { animate } = this.#data;
        const { use: animateUse, type, duration } = animate;
        const animateFunction = util.AnimateUtil.getFunction(type);
        const st = performance.now();
        const fn = (t) => {
            const gap = t - st;
            let per;

            if (!animateUse) {
                per = 1;
            } else {
                per = gap / duration;
                per = per < 1 ? animateFunction(per) : 1;
            }

            this.excute(per);
            if (per === 1) {
                window.cancelAnimationFrame(fn);
            } else {
                window.requestAnimationFrame(fn);
            }
        };

        window.requestAnimationFrame(fn);
    }

    excute(per) {
        util.CanvasUtil.clear(this.#mainLayer);
        this.rednerHeader();
        this.renderLengend();
        this.renderAxis();

        this.#charts.forEach((chart) => {
            chart.draw(per);
        });
    }

    rednerHeader() {}

    renderLengend() {}

    renderAxis() {}
}

export default Chart;
