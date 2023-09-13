/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
import NMModel from "main/model/core/NMModel.js";
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMSideEffect {
    get model() {
        return NMModel; 
    }
}

export default NMSideEffect;
