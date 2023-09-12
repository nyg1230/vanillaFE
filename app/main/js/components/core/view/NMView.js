/* inherit */
import { NMComponent, define } from "main/components/core/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMView extends NMComponent {
    modelList = [];

    constructor() {
        super();
    }

    static get name() {
        return "nm-view";
    }

    get name() {
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

    #addEvent() {
        this.bindEvent(this, "modelChange", this.onModelChange);
        this.addEvent();
    }

    afterRender() {
        super.afterRender();
        this.#observeModel();
    }

    onModelChange() {}

    destroy() {
        this.#disconnectModel();
        super.destroy();
    }
}

define(NMView);

export { NMView, define };
