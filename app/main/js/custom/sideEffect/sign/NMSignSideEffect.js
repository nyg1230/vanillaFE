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
            login: "user/login",
            signup: "user/signup",
            doubleCheck: "user/doubleCheck"
        };
    }

    async signin() {
        const data = NMUserModel.get("signin");
		const state = await util.FetchUtil.POST(NMSignSideEffect.url.login, data);
        NMUserModel.set("login", state);
    }

    async signup() {
        const data = NMUserModel.get("signup");
        const { account, pwd, nickname, email = {}, sex } = data;
        const info = {
            account,
            pwd,
            nickname,
            sex
        };

        if (util.CommonUtil.isNotEmpty(email)) {
            info.email = `${data.email.account}@${data.email.domain}`;
        }

        const result = await util.FetchUtil.POST(NMSignSideEffect.url.signup, info);
        NMUserModel.set("register", result);
    }

    async doubleCheck() {
        const data = NMUserModel.get("signup");
        const { account } = { ...data };

        const result = await util.FetchUtil.POST(NMSignSideEffect.url.doubleCheck, { account });
        const duplicate = util.CommonUtil.find(result, "data.duplicate");
        NMUserModel.set("duplicate", duplicate);
    }
}

const signEffect = new NMSignSideEffect();

export default signEffect;
