/* inherit */
import { NMView, define } from "main/component/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
import * as element from "main/component/element/elements.js"
import { NMChart } from "main/component/chart/NMChart.js"
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

            .chart-area {
                display: flex;
            }

            .chart {
                margin-right: 4px;
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
            <div class="chart-area">
                <nm-chart class="chart"></nm-chart>
            </div>
        </div>
        `
    }

    addEvent() {}

    afterRender() {
        const data = {
            type: "pie",
            title: {
                text: "Pie Chart"
            },
            data: {
                amy: 1000,
                bart: 2500,
                chacy: 1234,
                dewin: 234,
                ecco: 5671,
                fiore: 301,
                grace: 2013,
                honey: 4233,
                icy: 234
            }
        }

        const chart = util.DomUtil.querySelector(this, "nm-chart");
        if (chart) {
            chart.setChart(data);
            chart.draw();
        }
    }
}

define(NMMain);