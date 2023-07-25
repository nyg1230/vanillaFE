/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

const viewStore = {};

class NMModel {
    constructor() {
        this.init();
    }

    static addView(target) {
        const { name } = this;
        if (util.CommonUtil.isNull(viewStore[name])) {
            viewStore[name] = {
                model: new this(),
                viewList: [target]
            };
        } else {
            viewStore[name].viewList.push(target);
        }
        console.log(viewStore);
    }

    static removeView(target) {
        const { name } = this;
        
    }

    static removeAllView() {
        viewStore = {};
    }

    init() {}
}

export default NMModel;
