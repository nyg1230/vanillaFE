/* inherit */
import AxisChart from "js/core/chart/interface/axis/AxisChart.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import charts from "js/core/chart/charts.js";
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
/* option */
import CommonOption from "js/core/chart/option/CommonOption.js";

const paddingRatio = 0.1;

class ColumnChart extends AxisChart {
    #data;
    #draw;

    parse() {
        this.#data = [];
        this.#draw = {
            bar: new Map(),
            dataLabel: {}
        };

        const { chart } = { ...this.area };
        const { x, y, width, height } = chart;
        const { bar, dataLabel } = this.#draw;

        const { axis } = this.option;
        const { ly, ry } = axis;

        const xLabel = util.CommonUtil.find(this.option, `axis.x.label`, {});
        const { width: xWidth } = xLabel;
        const padding = xWidth * paddingRatio;
        const realWidth = xWidth - padding;
        const barWidth = util.CommonUtil.round(realWidth / util.CommonUtil.length(this.data), 12);
        const { palette } = this.option;

        this.data.forEach((obj, pIdx) => {
            const { list, axis } = obj;
            const axisType = axis === "r" ? "ry" : "ly";
            const info = util.CommonUtil.find(this.option, `axis.${axisType}.info`, {});
            const { min, max } = info;
            const total = max - min;

            !bar.has(axisType) && bar.set(axisType, []);
            const color = util.ColorUtil.getPaletteColor(palette, pIdx);
            const drawBarList = [];

            const stX = x + padding + barWidth * pIdx;
            list.forEach((d, idx) => {
                const { title, value } = { ...d };
                const ratio = value / total;
                const barHeight = height * ratio;
                const stY = y + height - barHeight;
                const rect = util.CanvasUtil.rect(stX + xWidth * idx, stY, barWidth, barHeight, { style: { fillStyle: color } });
                drawBarList.push(rect);
            });

            bar.get(axisType).push(drawBarList);
        });
    }

    draw(ctx, per) {
        const { chart } = this.area;
        const { x, y, width, height } = chart;

        const { bar } = this.#draw;
        const entries = bar.entries();

        while (true) {
            const { done, value } = entries.next();

            if (done) break;

            const [k, v] = value;
            v.forEach((list) => {
                list.forEach((d) => {
                    d.draw(ctx, per);
                });
            });
        }
    }

    contains(mx, my, e) {
        let result = false;
        const { chart } = this.area;
        const { x, y, width, height } = chart;

        if (mx < x || mx > x + width) {
        } else if (my < y || my > y + height) {
        } else {
            result = true;
        }

        return result;
    }

    getTooltipContent(mx, my, ctx, e) {
        const { chart } = this.area;
        const { x, y, width, height } = chart;
        const xWidth = util.CommonUtil.find(this.option, `axis.x.label.width`);
        const idx = util.CommonUtil.floor((mx - x) / xWidth);

        this.#setDim(idx, ctx);
        const html = this.#getTooltipContent(idx);
        return html;
    }

    #getTooltipContent(idx) {
        const data = this.data.map((d) => d.list[idx]);
        const { palette } = this.option;

        return data.map((d, idx) => {
            const { title, value } = d;
            const color = util.ColorUtil.getPaletteColor(palette, idx);
            return `
            <div class="info">
                <div class="color" style="--bg-color: ${color};"></div>
                <div class="title">${title}</div>
                <div class="value">${value}</div>
            </div>
            `;
        }).join("");
    }

    #setDim(idx, ctx) {
        const { chart } = this.area;
        const { x, y, height } = chart; 
        const width = util.CommonUtil.find(this.option, `axis.x.label.width`);

        const param = {
            style: {
                fillStyle: "gray",
                globalAlpha: 0.1
            }
        }
        const rect = util.CanvasUtil.rect(x + width * idx, y, width, height, param);
        rect.draw(ctx);
    }
}

export default ColumnChart;
