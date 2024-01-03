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
    #proxy;

    static createModel() {
        if (util.CommonUtil.isNotNull(store.get("model", this.name))) return;
        store.set("model", this.name, new this());
    }

    static get model() {
        return store.get("model", this.name);
    }
    
    static subscribe(view, option) {
        util.CommonUtil.isNull(store.get("model", this.name)) && this.createModel();
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

    static get(props) {
		let data;

		if (util.CommonUtil.isEmpty(props)) {
			data = this.model.#data;
		} else {
			if (!util.CommonUtil.isArray(props)) {
				props = [props];
			}

			data = util.CommonUtil.find(this.model.#data, props);
		}
		
        return data;
    }

    static set(props, data) {
        if (this.model) {
			!util.CommonUtil.isArray(props) && (props = [props]);
            this.model.set(props, data);
        } else {
            console.log(`model is not exist...`);
        }
    }

    static clear() {
        if (this.model) {
            this.model.clear();
        }
    }

    constructor() {
        this.#viewList = [];
        this.init();
    }

    static get name() {
        return "model";
    }

    get clsName() {
        return NMModel.name;
    }

    get proxy() {
        return this.#proxy;
    }

    init() {
        this.#data = {};
        this.#proxy = util.ProxyUtil.create(this.#data);
    }

    set(props = [], data) {
		const _props = [...props];

		const lastProp = _props.pop();
		let cur = this.#proxy;
		const len = util.CommonUtil.length(_props);
		for (let idx = 0; idx < len; idx++) {
			const prop = _props[idx];
			const tmp = cur[prop];

			if (!tmp || !util.CommonUtil.isObject(tmp)) {
				cur[prop] = {};
			}

			cur = cur[prop];
		}

		cur[lastProp] = data;

        const param = {
            name: this.clsName,
			path: props,
            property: lastProp,
            data: cur[lastProp]
        };

        this.#viewList.forEach((v) => {
            const { view } = { ...v };
            util.EventUtil.dispatchEvent(view, NMConst.eventName.MODEL_CHANGE, param);
        });
    }

    clear() {
        this.init();
    }

    async setView(view, option) {
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
