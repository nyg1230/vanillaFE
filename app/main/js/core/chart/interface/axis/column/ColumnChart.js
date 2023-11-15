/* inherit */
import AxisChart from "js/core/chart/interface/axis/AxisChart.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import charts from "js/core/chart/charts.js";
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
/* option */
import CommonOption from "js/core/chart/option/CommonOption.js";

class ColumnChart extends AxisChart {
    #data;
    #draw;

    parse() {
        this.#data = [];
        this.#draw = {
            bar: new Map(),
            dataLabel: {}
        };

        const { axis } = this.option;
        const { ly, ry } = axis;

        this.data.forEach((obj) => {
            const { list, axis } = obj;
            const axisType = axis === "r" ? "ry" : "ly";
            const info = util.CommonUtil.find(this.option, `axis.${axisType}.info`, {});
            const { min, max } = info;
            const total = max - min;

            list.forEach((d) => {
                const { title, value } = { ...d };
                const ratio = value / total;
            });
        });

        console.log(this.option);
        console.log(this.#data);
        console.log(this.#draw);
    }
}

export default ColumnChart;
