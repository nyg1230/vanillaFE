/* inherit */
import { NMComponent, define } from "main/components/core/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant";

export default class NMFooter extends NMComponent {
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-footer";
    }

    get clsName() {
        return NMFooter.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                border: 1px solid green;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    내용 고민 필요...
                </div>`;
    }
}

define(NMFooter);
