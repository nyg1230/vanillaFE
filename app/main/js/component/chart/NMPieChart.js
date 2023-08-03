/* inherit */
import { NMChart, define } from "main/component/chart/base/NMChart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMPieChart extends NMChart {
    static get name() {
        return `nm-pie-chart`;
    }

    get clsName() {
        return NMPieChart.name;
    }
    
    get layerList() {
        window.qqq = this;
        return [`graphic`, `hover`];
    }
    
    parseOption(obj) {
        let option = {
            chart: {
                startAngle: -Math.PI / 2,
                scale: 0.9
            }
        };

        option = util.CommonUtil.shallowMerge(option, obj);

        return option;
    }

    parseData(data) {
        const { palertte } = { ...this.option };
        const { width, height } = this.rect;
        let entries = Object.entries(data);
        entries.sort((a, b) => a[1] < b[1]);

        const max = width < height ? width : height;
        const x = width / 2;
        const y = height / 2;
        const r = max / 2 * 0.9;

        const colorList = util.ColorUtil.getPalette(palertte);

        const total = entries.reduce((acc, val) => acc += val[1], 0);
        let startAngle = util.CommonUtil.find(this.option, "chart.startAngle");

        const list = [];
        entries.forEach((ent, idx) => {
            const [name, value] = [...ent];
            const ratio = value / total;
            const angle = Math.PI * 2 * ratio;
            const endAngle = startAngle + angle;
            const styles = {
                fillStyle: colorList[idx]
            };
            const arc = util.CanvasUtil.arc(x, y, r, startAngle, endAngle, "fill", styles);
            startAngle += angle;

            const info = { name, value, ratio }
            list.push({ ...arc, info });
        });

        const chartData = {
            data: list,
            x,
            y,
            r,
            total
        };
        return chartData;
    }

    draw() {
        this.#drawPie();
        this.#drawDataLabel();
    }

    #drawPie() {
        const { data } = { ...this.chartData };
        const layer = this.layers["graphic"];
        const { canvas, ctx } = { ...layer };

        const { animate } = { ...this.option };
        let { use, delay } = { ...animate };
        const start = performance.now();
        if (use !== true) {
            delay = 1;
        }

        const fn = (time) => {
            this.clear("graphic");
            const remaingTime = time - start;
            const ramaingRatio = remaingTime / delay;
            const progress = ramaingRatio >= 1 ? 1 : ramaingRatio;

            data.forEach((d) => {
                d.draw(ctx, progress);
            });

            if (progress === 1) {
                window.cancelAnimationFrame(fn);
            } else {
                window.requestAnimationFrame(fn);
            }
        }

        window.requestAnimationFrame(fn);
    }

    #drawDataLabel() {}

    getTooltipContent(e) {
        const { clientX: x, clientY: y } = e;
        const bool = this.#isInPie(x, y);
        const data = bool === true ? this.#getCoorData(x, y) : "";
        const html = data ? this.#getTooltipHtml(data) : "";

        return html;
    }

    #getCoorData(mx, my) {
        const { x, y, data } = { ...this.chartData };

        const startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        const degree = this.#getDegree(mx, my);
        const radian = degree * Math.PI / 180 + startAngle;

        const result = data.find((d) => {
            const { startAngle, endAngle } = { ...d };
            return startAngle < radian && endAngle > radian;
        });
        
        return result;
    }

    #getDegree(mx, my) {
        const { x, y } = { ...this.chartData };
        const startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        const radian = (Math.atan2(my - y, mx - x) - startAngle) * 180 / Math.PI;
        const degree = radian < 0 ? radian + 360 : radian;;

        return degree;
    }

    #getTooltipHtml(data) {
        const { info } = { ...data };
        const { name, value, ratio } = { ...info };
        const r = util.CommonUtil.round(ratio * 100, 2);
        const html = `${name} ${value} (${r}%)`;

        return html;
    }

    #isInPie(mx, my) {
        const { x, y, r } = { ...this.chartData };
        const gapX = Math.abs(mx - x);
        const gapY = Math.abs(my - y);

        let result = false;

        if (gapX + gapY <= r) {
            result = true;
        } else if (gapX > r || gapY > r) {
        } else if (gapX ** 2 + gapY ** 2 <= r ** 2) {
            result = true;
        }

        return result;
    }
}

define(NMPieChart);

export { NMPieChart, define };
