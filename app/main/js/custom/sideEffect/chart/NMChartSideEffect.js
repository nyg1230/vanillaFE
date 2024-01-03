/* inherit */
import NMSideEffect from "js/core/sideEffect/NMSideEffect";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMChartModel from "js/custom/model/chart/NMChartModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMChartSideEffect extends NMSideEffect {
    static get url() {
        return {
            SPENDING_RATIO: "chart/spending-ratio"
        };
    }
    
    getSpendingRatio() {
        NMChartModel.set("spendingRatio", { list: [
            { title: "test0", value: 1234 },
            { title: "test1", value: 222 },
            { title: "test2", value: 3546 },
            { title: "test3", value: 12 },
        ] });
    }
}

const chartSideEffect = new NMChartSideEffect();

export default chartSideEffect;
