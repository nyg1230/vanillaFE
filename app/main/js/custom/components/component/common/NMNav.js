/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant";

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
                    간단한 개인정보<br>메뉴 리스트
                </div>`;
    }
}

define(NMNav);