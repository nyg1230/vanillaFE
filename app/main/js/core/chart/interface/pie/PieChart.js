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

    parse() {
        const [data] = [...this.data];
        this.#data = util.CommonUtil.shallowMerge(PieOption, data);
        this.setInfo();
        const { x, y, r } = this.#info;
        const { palette } = this.option;
        const { list = [], startAngle } = this.#data;
        const { pie, dataLabel } = this.#draw;
        const total = list.reduce((acc, d) => acc + Number(d.value), 0);

        let currentRadian = util.CommonUtil.degreeToRadian(startAngle);
        const parseList = list.map((d, idx) => {
            const { value } = { ...d };
            const ratio = value / total;

            const radian = Math.PI * 2 * ratio;
            const endRadian = currentRadian + radian;

            const color = util.ColorUtil.getPaletteColor(palette, idx);

            const arc = util.CanvasUtil.arc(x, y, r, currentRadian, endRadian, { style: { fillStyle: color } });
            pie.push(arc);
            currentRadian = endRadian;
            return {
                ...d,
                ratio,
                startRadian: currentRadian,
                endRadian: endRadian
            };
        });
    }

    setInfo() {
        const { chart } = { ...this.area };
        const { x, y, width, height } = { ...chart };
        this.#info = {
            x: width / 2 + x,
            y: height / 2 + y,
        };
        
        let { scale } = { ...this.#data };
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
