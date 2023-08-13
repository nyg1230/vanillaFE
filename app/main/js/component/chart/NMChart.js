/* inherit */
import { NMComponent, define } from "main/component/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

import PieChart from "main/chart/pie/PieChart";

class NMChart extends NMComponent {
    #layers = {};
    #chart;

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
            }

            .${this.clsName} canvas {
                position: absolute;
                background-color: transparent;
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <canvas class="main-layer"></canvas>
                    <canvas class="sub-layer"></canvas>
                <div>`;
    }

    afterRender() {
        const mainLayer = util.DomUtil.querySelector(this, ".main-layer");
        if (mainLayer) {
            this.#layers.mainLayer = {
                canvas: mainLayer,
                ctx: mainLayer.getContext("2d")
            };
        }

        const subLayer = util.DomUtil.querySelector(this, ".sub-layer");
        if (subLayer) {
            this.#layers.subLayer = {
                canvas: subLayer,
                ctx: subLayer.getContext("2d")
            }
        }

        this.#resize();
    }

    #resize() {
        const { width: w, height: h } = this.rect;
        Object.values(this.#layers).forEach((layer) => {
            const { canvas } = { ...layer };
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);

            const rect = util.StyleUtil.getBoundingClientRect(canvas);
            const { x, y, width, height } = rect;
            layer.rect = new DOMRectReadOnly(x, y, width, height);
        });
    }

    setChart(param) {
        const { type, ...p } = { ...param };

        // const chart = charts[type];
        const chart = PieChart;

        if (chart) {
            const { mainLayer, subLayer } = { ...this.#layers };
            this.#chart = new chart(mainLayer, subLayer);
            this.#chart.setting(p);
        } else {
            this.clear();
        }
    }

    draw() {
        this.#chart && this.#chart.draw();
    }

    clear() {
        Object.values(this.#layers).forEach((layer) => {
            const { canvas } = { ...layer };
            util.CanvasUtil.clear(canvas);
        });
    }
}

define(NMChart);
export { NMChart, define };