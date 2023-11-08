/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
import Chart from "js/core/chart/Chart.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMChart extends NMComponent {
    #layers = {};
    #chart;
    #tooltip;

    static get name() {
        return "nm-chart"
    }

    get clsName() {
        return NMChart.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
                overflow: hidden;
                position: relative;
            }

            .${this.clsName} canvas {
                position: absolute;
                background-color: transparent;
            }
        `;
    }

    set data(d) {
        this.#chart.data = d;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                <div>`;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CHART_DRAW_COMPLETE, this.onChartComplete);
    }

    afterRender() {
        this.initChart();
    }

    initChart() {
        const container = util.DomUtil.querySelector(this, `.${this.clsName}`);
        this.#chart = new Chart({ container });
        console.log(this.#chart);
    }

    onChartComplete(e) {
        const { detail } = e;
        let { tooltip } = { ...detail };
        tooltip = util.CommonUtil.toBoolean(tooltip);

        if (tooltip === true) {
        }
    }
}

define(NMChart);
export { NMChart, define };
