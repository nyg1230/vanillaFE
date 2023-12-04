/* inherit */
import NMSideEffect from "js/core/sideEffect/NMSideEffect";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMUserModel from "js/custom/model/user/NMUserModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMSignSideEffect extends NMSideEffect {
    static url() {
        return {
            login: "/user/login"
        };
    }

    async doSignIn() {
        NMUserModel.set("login", "test");
        const state = await util.FetchUtil.POST(NMSignSideEffect.url.login, {});
        console.log(state);
    }
}

const signEffect = new NMSignSideEffect();

export default signEffect;
