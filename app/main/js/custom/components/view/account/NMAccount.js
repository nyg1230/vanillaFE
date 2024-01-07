/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import { NMChart } from "js/core/components/chart/NMChart";
/* model */
import NMChartModel from "js/custom/model/chart/NMChartModel.js";
/* intent */
import chartIntent from "js/custom/intent/chart/NMChartIntent.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMAccount extends NMView {
    static get name() {
        return "nm-account";
    }

    get clsName() {
        return NMAccount.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                height: 100%;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <slot></slot>
        </div>`;
    }
}

define(NMAccount);
