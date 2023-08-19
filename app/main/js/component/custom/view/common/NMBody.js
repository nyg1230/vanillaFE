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
            <div>머리</div>
            <div>
                가운데
                <div>왼쪽</div>
                <div>
                    <slot></slot>
                </div>
                <div>오른쪽</div>
            </div>
            <div>꼬리</div>
        </div>
        `;
    }

    addEvent() {}

    afterRender() {}
}

define(NMBody);