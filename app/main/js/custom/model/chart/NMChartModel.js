/* inherit */
import NMModel from "js/core/model/NMModel.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMChartModel extends NMModel {
    static get name() {
        return "chart";
    }

    get clsName() {
        return NMChartModel.name;
    }
}

export default NMChartModel;
