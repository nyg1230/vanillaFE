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

class Chart {
    #data = [];
    #area;

    constructor() {}

    get data() {
        return this.#data;
    }

    get area() {
        return this.#area;
    }

    set area(area) {
        this.#area = area;
    }

    add(data) {
        this.#data.push(data);
    }

    parse() {}

    clear() {
        this.#data = [];
    }

    draw() {}
}

export default Chart;
