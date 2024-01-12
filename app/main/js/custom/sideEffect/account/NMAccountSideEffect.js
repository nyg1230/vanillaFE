/* inherit */
import NMSideEffect from "js/core/sideEffect/NMSideEffect";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMAccountModel from "js/custom/model/account/NMAccountModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMAccountSideEffect extends NMSideEffect {
    static get url() {
        return {
            ADD_LIST: "account/list/add"
        };
    }
    
    async addList(list) {
        const result = await this.api(NMAccountSideEffect.url.ADD_LIST, NMConst.method.POST, { list }, { contentType: null });
        NMAccountModel.setState("addList", result);
    }
}

const accountSideEffect = new NMAccountSideEffect();

export default accountSideEffect;
