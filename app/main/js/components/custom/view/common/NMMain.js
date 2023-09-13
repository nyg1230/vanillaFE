/* inherit */
import { NMView, define } from "main/components/core/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* intent */
import githubIntent from "main/intent/custom/NMGithubIntent.js";
/* constant */
import NMConst from "main/constant/NMConstant.js";

export default class NMMain extends NMView {
    modelList = [];

    static get name() {
        return "nm-main";
    }

    get clsName() {
        return NMMain.name;
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
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <slot></slot>
                </div>`;
    }

    addEvent() {}

    afterRender() {}
}

define(NMMain);