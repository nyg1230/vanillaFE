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

    addList() {
        const list = NMAccountModel.get(["list"]);
        accountSideEffect.addList(list);
    }

    getList(param, page) {
        accountSideEffect.getList(param, page);
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
}

const accountIntent = new NMAccountIntent();

export default accountIntent;
