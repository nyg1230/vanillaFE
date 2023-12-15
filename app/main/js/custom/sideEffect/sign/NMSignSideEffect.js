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

    async signin() {
        const data = NMUserModel.get("signin");
		const state = await util.FetchUtil.POST(NMSignSideEffect.url.login, data);
        NMUserModel.set("login", state);
    }

    async signup() {
        const data = NMUserModel.get("signup");
        console.log(data);
        const info = {
            account: data.account,
            pwd: data.pwd,
            email: `${data.email.account}@${data.email.domain}`
        };

        const result = await util.FetchUtil.POST(NMSignSideEffect.url.signup, info);
        return result;
    }
}

const signEffect = new NMSignSideEffect();

export default signEffect;
