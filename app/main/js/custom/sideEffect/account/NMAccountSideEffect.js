/* inherit */
import NMSideEffect from "js/core/sideEffect/NMSideEffect";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMChartModel from "js/custom/model/chart/NMChartModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMAccountSideEffect extends NMSideEffect {
    static get url() {
        return {
            ADD_LIST: "account/list/add"
        };
    }
    
    async addList(list) {
        console.log(list);
        const result = await this.api(NMAccountSideEffect.url.ADD_LIST, NMConst.method.POST, { list });
        console.log(result);
    }
}

const accountSideEffect = new NMAccountSideEffect();

export default accountSideEffect;
