/* inherit */
import { NMComponent, define } from "main/component/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMChart extends NMComponent {
    #originData;
    #chartData;
    #layers = {};
    #option = {};
    #initOption = {
        animation: {
            use: true,
            type: "rapidly",
            speed: "default"
        },
        legend: {
            use: true,
            position: "r"
        }
    };
    
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

            .chart-area {
                position: relative;
            }

            .chart-area canvas {
                position: absolute;
                background-color: transparent;
            }
        `;
    }

    get template() {
        const htmlList = this.layerList.map((name) => `<canvas id="${name}"></canvas>`);
        return `<div part="${this.clsName}">
                    <div class="chart-area">${htmlList.join("")}</div>
                    <div class="legend-area"></div>
                </div>`;
    }

    get layerList() {
        return [`graphic`, `dataLabel`, `hover`];
    }

    get layers() {
        return this.#layers;
    }

    get chartData() {
        return this.#chartData;
    }

    get option() {
        return this.#option;
    }

    afterRender() {
        this.#setPosition();
        this.layerList.forEach((name) => {
            const canvas = util.DomUtil.querySelector(this, `#${name}`);
            if (canvas) {
                this.#layers[name] = {
                    canvas,
                    ctx: canvas.getContext("2d")
                }
            }
        });
    }

    setData(data, option) {
        this.#parseOption(option);
        this.#parseData(data);
        this.#draw();
    }

    #parseOption(obj) {
        const opiton = this.parseOption(obj);
        this.#option = util.CommonUtil.shallowMerge(this.#initOption, opiton);
    }

    #setPosition() {
        console.log(this.rect);
    }

    parseOption() {}

    #parseData(data) {
        this.#chartData = this.parseData(data);
    }

    parseData() {}

    #draw() {
        this.clear();
        this.draw();
    }

    draw() {}

    clear(name) {
        const target = this.#layers[name];
        const { ctx } = { ...target };

        // ctx && ctx
    }

    clearAll() {
        Object.keys(this.#layers).forEach((name) => {
            this.clear(name);
        });
    }
}

define(NMChart);

export { NMChart, define }