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
        if (ratio < minHideRatio) return;

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
        console.log(r, );

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
}

export default PieChart;
