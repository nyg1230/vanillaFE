/* inherit */
import { NMView, define } from "main/component/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
import * as element from "main/component/element/elements.js"
/* constant */
import NMConst from "main/constant/NMConstant";


export default class NMMain extends NMView {
    static get name() {
        return "nm-main";
    }

    get clsName() {
        return NMMain.name;
    }

    get styles() {
        return `
            nm-header {
                width: 100%;
            }

            .test {
                color: red;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.name}">
            <nm-input value="1"></nm-input>
            <nm-input value="2"></nm-input>
        </div>
        `
    }
}

define(NMMain);