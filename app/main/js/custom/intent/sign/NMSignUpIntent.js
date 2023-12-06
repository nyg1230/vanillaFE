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
        // vaild check
        let vaild = false;

        if (vaild) {
            signEffect.doSignUp();
        } else {
            // 변수 저장 없이 state만 전달하는 기능 추가 필요
        }
    }

    setInfo(prop = [], value) {
        if (util.CommonUtil.isString(prop)) {
            prop = [prop];
        }
        NMUserModel.set(["signup", ...prop], value);
    }

    checkPassword(value) {
        const pw = NMUserModel.get(["signup", "password"]);
        const state = util.CommonUtil.isNotEmpty(pw) && pw === value;
        NMUserModel.set(["signup", "pwCheck"], state);
    }
}

const signUpIntent = new NMSignUpIntent();

export default signUpIntent;
