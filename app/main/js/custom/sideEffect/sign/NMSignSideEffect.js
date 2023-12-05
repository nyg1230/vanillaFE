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
    static get url() {
        return {
            login: "/user/login"
        };
    }

    async doSignIn() {
		const state = await util.FetchUtil.POST(NMSignSideEffect.url.login, {});
        NMUserModel.set("login", state);
    }
}

const signEffect = new NMSignSideEffect();

export default signEffect;
