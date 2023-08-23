/* inherit */
import { NMComponent, define } from "main/components/core/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant";

export default class NMNav extends NMComponent {
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-nav";
    }

    get clsName() {
        return NMNav.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                border: 1px solid blue;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    나비게이터
                </div>`;
    }
}

define(NMNav);
