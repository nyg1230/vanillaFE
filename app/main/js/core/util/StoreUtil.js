/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class StoreUtil {
    #store;

    constructor() {
        window.qqq = this;
        this.#store = {};
        this.init();
    }

    init() {}

    get(target = "", key = "") {
        return util.CommonUtil.find(this.#store, `${target}.${key}`);
    }

    set(target, key, value) {
        key = !util.CommonUtil.isArray(key) ? key.split(".") : key;
        const last = key.pop();

        util.CommonUtil.isNull(this.#store[target]) && (this.#store[target] = {});

        let p = this.#store[target];

        key.forEach((k) => {
            util.CommonUtil.isNull(p[k]) && (p[k] = {});
            p = p[k];
        });

        p[last] = value;
    }

    getLocalStorage(key, defaultValue = null) {
        let result = localStorage.getItem(key);

        if (util.CommonUtil.isNull(result)) {
            this.setLocalStorage(key, defaultValue);
            result = defaultValue;
        }

        return result;
    }

    setLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    removeLocalStorage(key) {
        localStorage.removeItem(key);
    }

    getSessionStorage(key, defaultValue = null) {
        const result = sessionStorage.getItem(key);

        if (util.CommonUtil.isNotNull(result)) {
            this.setSessrionStorage(key, defaultValue);
        }

        return result;
    }

    setSessrionStorage(key, value) {
        return sessionStorage.setItem(key, value);
    }

    removeSessionStorage(key) {
        sessionStorage.removeItem(key);
    }
}

const store = new StoreUtil();

export default store;