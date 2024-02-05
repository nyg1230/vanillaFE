/* inherit */
import NMIntent from "js/core/intent/NMIntent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* side effect */
import accountSideEffect from "js/custom/sideEffect/account/NMAccountSideEffect.js";
/* model */
import NMAccountModel from "js/custom/model/account/NMAccountModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMAccountIntent extends NMIntent {
    model = NMAccountModel;

    addList(param) {
        accountSideEffect.addList(param);
    }

    getList(param) {
        accountSideEffect.getList(param);
    }

    update(oid, param) {
        accountSideEffect.update(oid, param);
    }

    addTag(param) {
        accountSideEffect.addTag(param);
    }

    removeTag(oid) {
        accountSideEffect.removeTag(oid);
    }

    getPeriodData(param) {
        accountSideEffect.getPeriodData(param);
    }

    getPeriodCategoryData(param) {
        accountSideEffect.getPeriodCategoryData(param)
    }
}

const accountIntent = new NMAccountIntent();

export default accountIntent;
