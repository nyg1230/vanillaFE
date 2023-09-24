/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
import charts from "js/core/chart/charts.js";
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

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <canvas class="main-layer"></canvas>
                    <canvas class="sub-layer"></canvas>
                <div>`;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CHART_DRAW_COMPLETE, this.onChartComplete);
    }

    onChartComplete(e) {
        const { detail } = e;
        let { tooltip } = { ...detail };
        tooltip = util.CommonUtil.toBoolean(tooltip);

        if (tooltip === true) {
            this.#tooltip = util.TooltipUtil.setTooltip(this, this.#getTooltipContent);
        }
    }

    resize() {
        this.#resize();
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

        const wrapper = util.DomUtil.querySelector(this, `.${this.clsName}`);
        const fn = () => util.CommonUtil.debounce(this, "resize");
        util.ObserverUtil.resizeObserver(this, [wrapper], fn);

        this.#resize();
    }

    #resize() {
        this.setRect();
        const { width: w, height: h } = this.rect;
        Object.values(this.#layers).forEach((layer) => {
            const { canvas } = { ...layer };
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);

            const rect = util.StyleUtil.getBoundingClientRect(canvas);
            const { x, y, width, height } = rect;
            layer.rect = new DOMRectReadOnly(x, y, width, height);
        });

        if (this.#chart) {
            this.#chart.refresh();
            this.draw();
        }
    }

    setChart(param) {
        const { type, ...p } = { ...param };

        const chart = charts[type];

        if (chart) {
            const { mainLayer, subLayer } = { ...this.#layers };
            this.#chart = new chart(mainLayer, subLayer, this);
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

    #getTooltipContent(e) {
        if (!this.#chart) return;

        const { left, top } = this.rect;
        const { clientX, clientY } = e;

        const x = clientX - left;
        const y = clientY - top;

        const content = this.#chart.getTooltipHTML(x, y, e);
        return content;
    }
}

define(NMChart);
export { NMChart, define };