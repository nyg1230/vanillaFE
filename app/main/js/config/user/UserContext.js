/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class UserContext {
    static #user;

    static getUser() {
        let user;

        try {
            const token = util.store.getLocalStorage(NMConst.header.token);
            const jwt = token.split(".");
            const [header, payload, signature] = [...jwt];
            user = JSON.parse(atob(payload));
        } catch (e) {
            user = null;
        }

        return user
    }

    static isValid() {
        const user = this.getUser();
        let result = util.CommonUtil.isNotNull(user);

        if (result) {
            const now = new Date();
            const { iat, exp } = { ...user };
            const gap = now.getTimezoneOffset();
            const nowTime = now.getTime();
            const expTime = exp * 1000 - gap * 60000;

            result = nowTime <= expTime;
        }

        return result;
    }
}

export default UserContext;
