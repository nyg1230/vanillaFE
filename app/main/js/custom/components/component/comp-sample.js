/* inherit */
import { NMComponent, define } from "main/components/core/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant.js";

export default class NMCompSample extends NMComponent {
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-comp-sample";
    }

    get clsName() {
        return NMCompSample.name;
    }

    get styles() {
        return `
            .${this.clsName} {}
        `;
    }

    get template() {
        return ``;
    }
}

define(NMCompSample);
