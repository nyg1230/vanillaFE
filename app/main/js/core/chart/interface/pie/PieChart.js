/* inherit */
import Chart from "js/core/chart/interface/Chart.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import charts from "js/core/chart/charts.js";
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
/* option */
import PieOption from "js/core/chart/option/PieOption.js";

class PieChart extends Chart {
    #data;
    #draw = {
        pie: [],
        dataLabel: []
    };
    #info;

    get defaultOption() {
        return PieOption;
    }

    parse() {
        const [data] = [...this.data];
        this.#data = data;
        this.setInfo();
        const { x, y, r } = this.#info;
        const { palette } = this.option;
        const { list = [] } = this.#data;
        const { startAngle } = this.option;
        list.sort((a, b) => a.value < b.value ? -1 : 1);
        const { pie, dataLabel } = this.#draw;
        const total = list.reduce((acc, d) => acc + Number(d.value), 0);

        let currentRadian = util.CommonUtil.degreeToRadian(startAngle);
        list.forEach((d, idx) => {
            const { value, title } = { ...d };
            const ratio = value / total;

            const radian = Math.PI * 2 * ratio;
            const endRadian = currentRadian + radian;

            const color = util.ColorUtil.getPaletteColor(palette, idx);

            const arc = util.CanvasUtil.arc(x, y, r, currentRadian, endRadian, { style: { fillStyle: color } });
            pie.push(arc);

            const centerRadian = currentRadian + radian / 2;
            const text = this.#getDataLabel(title, centerRadian, ratio);
            text && dataLabel.push(text);

            currentRadian = endRadian;
        });
    }

    #getDataLabel(text, radian, ratio) {
        const { x, y, r } = this.#info;
        const { dataLabel } = this.option;
        const { enable, position, param, minHideRatio } = dataLabel;

        if (enable !== true) return;
        // if (ratio < minHideRatio) return;

        let tx = x;
        let ty = y;
        let parseR;
        radian = util.CommonUtil.modulo(radian, Math.PI * 2);

        let align = "cc";
        if (position !== "outter") {
            parseR = r / 2;
        } else {
            parseR = r * 1.02;
        }

        tx += Math.cos(radian) * parseR;
        ty += Math.sin(radian) * parseR;

        const p = util.CommonUtil.shallowMerge(param, { option: { position: align }});
        const label = util.CanvasUtil.text(tx, ty, text, p);

        return label;
    }

    setInfo() {
        const { chart } = { ...this.area };
        const { x, y, width, height } = { ...chart };
        this.#info = {
            x: width / 2 + x,
            y: height / 2 + y,
        };
        
        let { scale } = { ...this.option };
        if (scale > 90 || scale < 1) scale = 90;

        this.#info.r = Math.min(width, height) / 2 * scale / 100;
    }

    draw(ctx, per) {
        const { pie, dataLabel } = this.#draw;

        pie.forEach((p) => {
            p.draw(ctx, per);
        });

        if (per === 1) {
            dataLabel.forEach((d) => {
                d.draw(ctx);
            })
        }
    }

    contains(stX, stY, e) {
        const { x, y, r } = this.#info;
        const gapX = Math.abs(stX - x);
        const gapY = Math.abs(stY - y);
        
        let result = false;
        if (gapX + gapY <= r) {
            result = true;
        } else if (gapX > r || gapY > r) {
        } else if (gapX ** 2 + gapY ** 2 <= r ** 2) {
            result = true;
        }

        return result;
    }

    getTooltipContent(mx, my, ctx, e) {
        const radian = this.#getPointToRadian(mx, my);
        const { pie } = this.#draw;
        const idx = pie.findIndex((p) => {
            const { startAngle, endAngle } = p;
            return startAngle <= radian && endAngle > radian;
        });

        const { list } = this.#data;
        const data = list[idx];
        let html = "";
        if (data) {
            html = this.#getTooltipHtml(data);
            this.#setDim(idx, ctx);
        }

        return html;
    }

    #setDim(index, ctx) {
        const { pie, dataLabel } = this.#draw;
        const targetPie = pie[index];
        const targetDataLabel = dataLabel[index];

        const param = {
            style: {
                fillStyle: "white",
                globalAlpha: 0.5
            }
        };

        targetPie.draw(ctx, 1, param);
        targetDataLabel.draw(ctx);
    }

    #getPointToRadian(mx, my) {
        const { x, y } = this.#info;
        const { startAngle } = this.option;
        const startRadian = util.CommonUtil.degreeToRadian(startAngle);
        let radian = Math.atan2(my - y, mx - x);
        radian = radian >= startRadian ? radian : radian + Math.PI * 2;

        return radian;
    }

    #getTooltipHtml(data) {
        const { title, value } = data;

        return `<div class="flex">
                    <div>${title}</div>
                    <div>${value}</div>
                </div>`;
    }
}

export default PieChart;
