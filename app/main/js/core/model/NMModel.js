/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

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
    
    // static set model(model) {
    //     NMModel.model.data = data;
    // }

    static async subscribe(view, option) {
        util.CommonUtil.isNull(store.get("model", this.name)) && await this.createModel();
        this.model.setView(view, option);
    }

    static async removeView(view) {
        if (util.CommonUtil.isNull(this.model)) return;
        
        this.model.removeView(view);
    }

    static async removeAllView(view) {
        Object.entries(viewStore).forEach(([name, model]) => {
            model.removeView(view)
        });
    }

    static set(property, data) {
        if (this.model) {
            this.model.set(property, data);
        } else {
            console.log(`model is not exist...`);
        }
    }

    constructor() {
        this.#viewList = [];
        this.#data = {};
        this.init();
    }

    static get name() {
        return "model";
    }

    static get() {
        return this.model.#data;
    }

    get clsName() {
        return NMModel.name;
    }

    init() {}

    set(key, data) {
        this.#data[key] = data;

        const param = {
            name: this.clsName,
            property: key,
            data: data
        };

        this.#viewList.forEach((v) => {
            const { view } = { ...v };
            util.EventUtil.dispatchEvent(view, NMConst.eventName.MODEL_CHANGE, param);
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
