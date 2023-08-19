/* inherit */
import { NMView, define } from "main/component/core/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";


export default class NMMain extends NMView {
    modelList = [];

    static get name() {
        return "nm-main";
    }

    get clsName() {
        return NMMain.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <slot></slot>
        </div>
        `
    }

    addEvent() {}

    afterRender() {
        const pieData = {
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
        };

        const chart = util.DomUtil.querySelector(this, "nm-chart.pie");
        if (chart) {
            chart.setChart(pieData);
            chart.draw();
        }

        const axisData = {
            type: "column",
            title: {
                text: "Axis Chart"
            },
            data: [
                {
                    bart: 2500,
                    chacy: 1234,
                    dewin: 234,
                    amy: 1000,
                    ecco: 5671,
                    honey: 4233,
                    icy: 234,
                    grace: 2013,
                    fiore: 301,
                },
                {
                    amy: 1000,
                    honey: 4233,
                    icy: 234,
                    dewin: 234,
                    ecco: 7814,
                    chacy: 1234,
                    fifa: 301,
                    bard: 2500,
                    grace: 2013,
                },
                {
                    yg: 123,
                    ecco: 456,
                    VivaLaVida: 1379
                }
            ]
        };

        const chartColumn = util.DomUtil.querySelector(this, "nm-chart.column");
        if (chartColumn) {
            chartColumn.setChart(axisData);
            chartColumn.draw();
        }
    }
}

define(NMMain);