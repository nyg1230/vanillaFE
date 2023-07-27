/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

class StoreUtil {
    #store;

    constructor() {
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
}

const store = new StoreUtil();

export default store;