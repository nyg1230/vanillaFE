/* inherit */
import NMIntent from "js/core/intent/NMIntent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* side effect */
import signEffect from "js/custom/sideEffect/sign/NMSignSideEffect";
/* model */
import NMUserModel from "js/custom/model/user/NMUserModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMSignUpIntent extends NMIntent {
    register() {
        signEffect.signup()
    }

    setInfo(prop = [], value) {
        if (util.CommonUtil.isString(prop)) {
            prop = [prop];
        }
        NMUserModel.set(["signup", ...prop], value);
    }

    checkPassword(value) {
        const pw = NMUserModel.get(["signup", "pwd"]);
        const state = util.CommonUtil.isNotEmpty(pw) && pw === value;
        NMUserModel.set(["signup", "pwdCheck"], state);
    }

    doubleCheck() {
        signEffect.doubleCheck();
    }
}

const signUpIntent = new NMSignUpIntent();

export default signUpIntent;
