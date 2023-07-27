/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

const viewStore = {};
const store = util.store;

class NMModel {
    #viewList;
    #data;

    static async createModel() {
        if (util.CommonUtil.isNotNull(store.get("model", this.name))) return;
        store.set("model", this.name, new this());
    }

    static get model() {
        return store.get("model", this.name);
    }
    
    static set model(model) {
        NMModel.model.data = data;
    }

    static async subscribe(view, option) {
        util.CommonUtil.isNull(store.get("model", this.name)) && await NMModel.createModel();
        NMModel.model.setView(view, option);
    }

    static async removeView(view) {
        if (util.CommonUtil.isNull(NMModel.model)) return;
        
        NMModel.model.removeView(view);
    }

    static async removeAllView(view) {
        Object.entries(viewStore).forEach(([name, model]) => {
            model.removeView(view)
        });
    }

    constructor() {
        this.#viewList = [];
        this.init();
    }

    init() {}

    getData() {
        return this.#data;
    }

    setData(data) {
        this.#data;
        data;

        this.#viewList.forEach((v) => {
            util.EventUtil.dispatchEvent(v, "modelChange", this.#data);
        });
    }

    setView(view, option) {
        this.#viewList.push({ view, option });
    }

    removeView(view) {
        this.#viewList = this.#viewList.filter((v) => v.view !== view);
    }

    removeAllView() {
        this.#viewList = [];
    }

    destroy() {
        this.removeAllView();
    }
}

export default NMModel;
