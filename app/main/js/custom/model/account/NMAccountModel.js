/* inherit */
import NMModel from "js/core/model/NMModel.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMAccountModel extends NMModel {
    static get name() {
        return "account-book";
    }

    get clsName() {
        return NMAccountModel.name;
    }
}

export default NMAccountModel;
