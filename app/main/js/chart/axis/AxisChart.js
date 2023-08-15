/* inherit */
import Chart from "main/chart/base/Chart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import option from "main/chart/option/AxisOption.js";

class AxisChart extends Chart {
    #oldIndex;
    #toottipHTML;

    get chartType() {
        return "axis";
    }

    get option() {
        return option[this.chartType];
    }

    parseData() {
        return {};
    }
}

export default AxisChart;
