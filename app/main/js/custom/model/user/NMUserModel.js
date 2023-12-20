/* inherit */
import NMModel from "js/core/model/NMModel.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMUserModel extends NMModel {
    static get name() {
        return "user";
    }

    get clsName() {
        window.qqq = this;
        return NMUserModel.name;
    }

}

export default NMUserModel;
