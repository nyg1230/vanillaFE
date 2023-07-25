import { NMComponent, define } from "../NMComponent.js";

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
        console.log(this.modelList);
        this.modelList.forEach((model) => {
            model.addView(this);
        });
    }

    #disconnectModel() {

    }

    #disconnectAllModel() {

    }

    #addEvent() {
        this.bindEvent(this, "modelChange", this.onModelChange);
        console.log(123);
        this.addEvent();
    }

    afterRender() {
        super.afterRender();
        this.#observeModel();
    }

    onModelChange() {}

    destroy() {}
}

define(NMView);

export {
    NMView,
    define
};
