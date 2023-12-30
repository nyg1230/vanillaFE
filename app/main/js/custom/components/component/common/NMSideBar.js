/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* intent */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMSideBar extends NMComponent {
    static get name() {
        return "nm-side-bar";
    }

    get clsName() {
        return NMSideBar.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                --bg-color: var(--grapemist );
                background-color: var(--bg-color);
                height: 100%;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    test
                </div>`;
    }
}

define(NMSideBar);
