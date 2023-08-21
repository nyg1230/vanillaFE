/* inherit */
import { NMView, define } from "main/component/core/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";


export default class NMBody extends NMView {
    modelList = [];

    static get name() {
        return "nm-body-view";
    }

    get clsName() {
        return NMBody.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            나는 바디
            <slot></slot>
        </div>
        `;
    }

    addEvent() {
        window.qqq = this;
    }

    afterRender() {}
}

define(NMBody);