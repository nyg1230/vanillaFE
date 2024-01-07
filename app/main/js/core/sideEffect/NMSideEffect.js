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

    async api(url, method, data, option) {
        let result;
        try {
            method = method.toUpperCase();
        } catch {
            method = NMConst.method.GET;
        } finally {
            result = await util.FetchUtil[method](url, data, option);
        }

        return result;
    }
}

export default NMSideEffect;
