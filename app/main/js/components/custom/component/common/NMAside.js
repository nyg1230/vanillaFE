/* inherit */
import { NMComponent, define } from "main/components/core/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant";

export default class NMAside extends NMComponent {
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-aside";
    }

    get clsName() {
        return NMAside.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                border: 1px solid red;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    배너
                </div>`;
    }
}

define(NMAside);
