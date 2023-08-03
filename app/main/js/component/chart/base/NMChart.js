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
        parette: "rainbow",
        styles: {},
        animate: {
            use: true,
            type: "rapidly",
            delay: 1000
        },
        legend: {
            use: true,
            position: "r"
        },
        tooltip: {
            use: true
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

            .${this.clsName} canvas {
                position: absolute;
                background-color: transparent;
            }
        `;
    }

    get template() {
        const htmlList = this.layerList.map((name) => `<canvas id="${name}"></canvas>`);
        return `<div class="${this.clsName}" part="${this.clsName}">
                    ${htmlList.join("")}
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
        this.layerList.forEach((name) => {
            const canvas = util.DomUtil.querySelector(this, `#${name}`);
            if (canvas) {
                this.#layers[name] = {
                    canvas,
                    ctx: canvas.getContext("2d")
                }
            }
        });
        this.#resize(false);
    }

    set(data, option) {
        this.#parseOption(option);
        this.#parseData(data);
        this.#draw();
    }

    setData(data) {
        this.#parseData(data);
        this.#draw();
    }

    setOption(option) {
        this.#parseOption(option);
        this.#draw();
    }

    #parseOption(obj) {
        const opiton = this.parseOption(obj);
        this.#option = util.CommonUtil.shallowMerge(this.#initOption, opiton);
    }

    #resize(refresh = true) {
        const { width, height } = this.rect;

        Object.values(this.#layers).forEach((layer) => {
            const { canvas } = { ...layer };

            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
        });

        refresh === true && this.#draw();
    }

    parseOption() {}

    #parseData(data) {
        this.#chartData = this.parseData(data);
    }

    parseData() {}

    #draw() {
        this.draw();
        this.#setTooltip();
    }

    draw() {}

    clear(name) {
        const target = this.layers[name];
        const { canvas } = { ...target };

        util.CanvasUtil.clear(canvas);
    }

    clearAll() {
        Object.keys(this.#layers).forEach((name) => {
            this.clear(name);
        });
    }

    #setTooltip() {
        const { tooltip } = { ...this.option };
        const { use: tooltipUse } = { ...tooltip };

        if (tooltipUse === true) {
            this.bindEvent(this, NMConst.eventName.MOUSE_MOVE, this.#onMouseMove);
        } else {
            this.unbindEvent(this, NMConst.eventName.MOUSE_MOVE);
        }
    }

    #onMouseMove(e) {
        const content = this.getTooltipContent(e);
    }

    getTooltipContent(e) {}
}

define(NMChart);

export { NMChart, define }