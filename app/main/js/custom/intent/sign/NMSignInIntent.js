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

class NMSignInIntent extends NMIntent {
    setAccount(account) {
        NMUserModel.set("account", account);
    }

    setPassword(pw) {
        NMUserModel.set("pw", pw);
    }

    doSignIn() {
        signEffect.doSignIn();
    }
}

const signInIntent = new NMSignInIntent();

export default signInIntent;
