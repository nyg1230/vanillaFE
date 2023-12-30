/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* intent */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const weeklyLimit = 10;

export default class NMHome extends NMView {
    static get name() {
        return "nm-home";
    }

    get clsName() {
        return NMHome.name;
    }

    get styles() {
        return ``;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            home
        </div>`;
    }

    addEvent() {}

    afterRender() {}
}

define(NMHome);