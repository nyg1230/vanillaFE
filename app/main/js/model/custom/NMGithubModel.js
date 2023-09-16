/* inherit */
import NMModel from "main/model/core/NMModel.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMGithubModel extends NMModel {
    static get name() {
        return "github";
    }

    get clsName() {
        return NMGithubModel.name;
    }

}

export default NMGithubModel;
