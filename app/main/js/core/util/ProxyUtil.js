/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const ProxyUtil = {
    create(data = {}) {
        console.log(data, typeof data);
        const proxy = new Proxy(data, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                let result;

                if (util.CommonUtil.isObject(value)) {
                    result = ProxyUtil.create(value);
                } else {
                    Reflect.set(target, prop, value, receiver);
                    result = true;
                }
                return result;
            },
            deleteProperty(target, prop) {
                delete target[prop];
            }
        });

        return proxy
    }
};

export default ProxyUtil;