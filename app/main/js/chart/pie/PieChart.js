/* inherit */
import Chart from "main/chart/base/Chart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import CommonOption from "main/chart/option/CommonOption.js";

class PieChart extends Chart {
    get option() {
        return CommonOption;
    }

    parseData() {
        console.log(this.data);
    }

    draw() {}

    #draw() {}
}

export default PieChart;
