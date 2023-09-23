import * as util from "js/core/util/utils.js";

const AnimateUtil = {
    getFunction(type) {
        type = util.CommonUtil.isEmpty(type) ? "normal" : type;
        const fn = aniFnc[type];

        return fn;
    },
    getProgressFromRatio(type, ratio) {
        const result = AnimateUtil.getFunction(type)(ratio);
        return result;
    }
};

const aniFnc = {
    normal: (x) => x,
    speedly: (x) => x ** 5
};

export default AnimateUtil;
