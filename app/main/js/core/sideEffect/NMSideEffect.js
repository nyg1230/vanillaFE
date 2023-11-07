/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMModel from "js/core/model/NMModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMSideEffect {
    get model() {
        return NMModel; 
    }
}

export default NMSideEffect;
