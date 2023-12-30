/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import NMHeader from "js/custom/components/component/common/NMHeader.js";
import NMSideBar from "js/custom/components/component/common/NMSideBar.js";
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
        return `
            .${this.clsName} {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .container {
                height: 100%;
                border: 1px solid black;
            }

            nm-side-bar {
                position: fixed;
                height: 100%;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <nm-header></nm-header>
            <nm-side-bar></nm-side-bar>
            <div class="container">
                <slot></slot>
            </div>
        </div>`;
    }

    addEvent() {}

    afterRender() {}
}

define(NMBody);
