/* inherit */
import { NMView, define } from "main/component/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
import * as element from "main/component/element/elements.js"
import { NMPieChart } from "main/component/chart/NMPieChart.js"
import { NMAxisChart } from "main/component/chart/axisChart/NMAxisChart.js"
/* model */
import NMTestModel from "main/model/NMTestModel.js";
/* constant */
import NMConst from "main/constant/NMConstant.js";


export default class NMMain extends NMView {
    modelList = [NMTestModel];

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

            .chart {
                border: solid 1px blue;
                display: block;
                width: 600px;
                height: 400px;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.name}">
            <nm-input value="1"></nm-input>
            <nm-input value="2"></nm-input>
            <nm-axis-chart class="chart"></nm-axis-chart>
        </div>
        `
    }

    addEvent() {}

    afterRender() {
        const pieChart = util.DomUtil.querySelector(this, ".chart");
        const pieData = [{
            fiore: 301,
            bart: 2500,
            amy: 1000,
            dewin: 234,
            ecco: 5671,
            chacy: 1234
        },
        {
            fiore: 123,
            bart: 456,
            amy: 789,
            dewin: 753,
            ecco: 159,
            chacy: 1769,
            test: 1234
        }];
        pieChart.set(pieData);
    }
}

define(NMMain);