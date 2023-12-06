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
            login: "/user/login",
            signup: "/user/signup"
        };
    }

    async doSignIn() {
		const state = await util.FetchUtil.POST(NMSignSideEffect.url.login, {});
        console.log("state >>> ", state);
        NMUserModel.set("login", state);
    }

    async doSignUp() {
        const data = NMUserModel.get("signup");
        console.log(data);
        const result = await util.FetchUtil.POST(NMSignSideEffect.url.signup, {});
        console.log(result);
    }
}

const signEffect = new NMSignSideEffect();

export default signEffect;
