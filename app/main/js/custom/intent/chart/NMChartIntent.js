/* inherit */
import NMIntent from "js/core/intent/NMIntent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* side effect */
import chartSideEffect from "js/custom/sideEffect/chart/NMChartSideEffect.js";
/* model */
import NMChartModel from "js/custom/model/chart/NMChartModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMChartIntent extends NMIntent {
    getSpendingRatio() {
        chartSideEffect.getSpendingRatio();
    }
}

const chartIntent = new NMChartIntent();

export default chartIntent;
