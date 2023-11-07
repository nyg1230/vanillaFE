/* inherit */
import NMModel from "js/core/model/NMModel.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMGithubModel extends NMModel {
    static get name() {
        return "github";
    }

    get clsName() {
        return NMGithubModel.name;
    }

}

export default NMGithubModel;
