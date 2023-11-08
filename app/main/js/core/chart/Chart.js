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

    constructor(params) {
        const { container } = { ...params };
        this.#container = container;

        this.init();
    }

    get data() {
        return this.#data;
    }

    set data(d) {
        this.#data = d;
        this.parseData();
        this.draw();
    }

    init() {
        const rect = util.StyleUtil.getBoundingClientRect(this.#container);
        const { width, height } = rect;
        const canvas1 = util.DomUtil.createElement("canvas", { className: "main-layer", width, height });
        const canvas2 = util.DomUtil.createElement("canvas", { className: "over-layer", width, height });

        this.#container.appendChild(canvas1);
        this.#container.appendChild(canvas2);
    }

    parseData() {
        const map = new Map();
        const { data = [] } = this.#data;

        const hasAxisChart = this.isAxis();

        data.forEach((d) => {
            const { type, list } = d;
            !map.has(type) && map.set(type, new charts[type]);

            const chart = map.get(type);
            chart.add(list);
        });

        console.log(map);
    }

    isAxis() {
        const { data = [] } = { ...this.#data };
        const result = data.some((d) => axisChart.includes(d.type));

        return result;
    }

    draw() {
        const duration = 1000;
        const st = performance.now();
        const fn = (t) => {
            const gap = t - st;
            let per = gap / duration;
            per = per > 1 ? 1 : per;
            console.log(per);
            if (per === 1) {
                window.cancelAnimationFrame(fn);
            } else {
                window.requestAnimationFrame(fn);
            }
        };

        window.requestAnimationFrame(fn);
    }
}

export default Chart;
