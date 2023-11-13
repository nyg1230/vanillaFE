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
    #option = {};

    constructor() {}

    get data() {
        return this.#data;
    }

    get area() {
        return this.#area;
    }

    get area() {
        return this.#area;
    }

    set area(area) {
        this.#area = area;
    }

    get option() {
        return this.#option;
    }

    set option(option) {
        this.#option = util.CommonUtil.shallowMerge(this.defaultOption, option);
        
    }

    get defaultOption() {
        return {};
    }

    add(data) {
        this.#data.push(data);
    }

    parse() {}

    clear() {
        this.#data = [];
    }

    draw() {}

    getTooltip(x, y, ctx, e) {
        let html = "";

        if (this.#contains(x, y, e)) {
            html += this.getTooltipContent(x, y, ctx, e);
        }

        return html;
    }

    #contains(x, y, e) {
        return this.contains(x, y, e);
    }
    contains() {}

    getTooltipContent() {}
}

export default Chart;
