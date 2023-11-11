/* inherit */
import Chart from "js/core/chart/interface/Chart.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import charts from "js/core/chart/charts.js";
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
/* option */
import CommonOption from "js/core/chart/option/CommonOption.js";

class ColumnChart extends Chart {
    parse() {
        // console.log(this.data);
        console.log("parse");
    }
}

export default ColumnChart;
