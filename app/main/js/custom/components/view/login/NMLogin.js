/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* intent */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMLogin extends NMView {
    modelList = [];

    static get name() {
        return "nm-login";
    }

    get clsName() {
        return NMLogin.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
                background: var(--peach-fuzz);
                position: relative;
            }

            .wrapper {
                position: absolute;
                top: 50%;
                left: 50%;
                translate: -50% -50%;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="wrapper">
                        <slot></slot>
                    </div>
                </div>`;
    }

    afterRender() {}
}

define(NMLogin);