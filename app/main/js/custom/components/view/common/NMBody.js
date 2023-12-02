/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";


export default class NMBody extends NMView {
    modelList = [];

    static get name() {
        return "nm-body";
    }

    get clsName() {
        return NMBody.name;
    }

    get styles() {
        return ``;
    }

    get template() {
        return ``;
    }

    addEvent() {}

    afterRender() {}
}

define(NMBody);
