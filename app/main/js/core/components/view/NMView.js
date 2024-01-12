/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMView extends NMComponent {
    modelList = [];

    constructor() {
        super();
    }

    static get name() {
        return "nm-view";
    }

    get clsName() {
        return NMView.name;
    }

    #observeModel() {
        this.modelList.forEach((model) => {
            model.subscribe(this);
        });
    }

    #disconnectModel() {
        this.modelList.forEach((model) => {
            model.removeView(this);
        });
    }

    #disconnectAllModel() {

    }

    initBind() {
        super.initBind();
        this.bindEvent(this, NMConst.eventName.MODEL_CHANGE, this.onModelChange);
        this.bindEvent(this, NMConst.eventName.STATE_CHANGE, this.onStateChange);
    }

    afterRender() {
        this.#observeModel();
        super.afterRender();
    }

    onModelChange() {}

    onStateChange() {}

    destroy() {
        this.#disconnectModel();
        super.destroy();
    }
}

define(NMView);

export { NMView, define };
