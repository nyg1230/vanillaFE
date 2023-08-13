/* inherit */
import { NMChart, define } from "main/component/chart/base/NMChart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

/**
 * TODO LIST
 * 데이터 라벨 곂치는 경우 처리는 어떻게 진행할 것인지
 * 추가적인 옵션이 필요할 것인지...
 *  - 라벨 관련 옵션
 *  - 파이 관렵 옵션
 */

class NMPieChart extends NMChart {
    static get name() {
        return `nm-pie-chart`;
    }

    get clsName() {
        return NMPieChart.name;
    }
    
    get layerList() {
        return [`graphic`, `hover`];
    }
    
    parseOption(obj) {
        let option = {
            chart: {
                startAngle: -Math.PI / 2,
                scale: 0.9
            },
            animate: {
                type: "normal"
            }
        };

        option = util.CommonUtil.shallowMerge(option, obj);

        return option;
    }

    parseData(data) {
        const { palertte, styels: optionStyles } = { ...this.option };
        const { chart: chartStyles } = { ...optionStyles };
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
                ...chartStyles,
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
    }

    #drawPie() {
        const { data } = { ...this.chartData };
        const layer = this.layers["graphic"];
        const { canvas, ctx } = { ...layer };

        const { animate } = { ...this.option };
        let { use, type, delay } = { ...animate };
        const start = performance.now();
        if (use !== true) {
            delay = 1;
        }

        const getProgress = util.AnimationUtil.get(type);

        const fn = (time) => {
            this.clear("graphic");
            const remaingTime = time - start;
            const ramaingRatio = remaingTime / delay;
            const progress = ramaingRatio >= 1 ? 1 : getProgress(ramaingRatio);

            data.forEach((d) => {
                d.draw(ctx, progress);
            });

            if (progress === 1) {
                window.cancelAnimationFrame(fn);
                this.#drawDataLabel();
            } else {
                window.requestAnimationFrame(fn);
            }
        }

        window.requestAnimationFrame(fn);
    }

    #drawDataLabel() {
        const { styles } = { ...this.option };
        const { dataLabel: dataLabelStyles } = { ...styles };
        const { data, x, y, r } = { ...this.chartData };
        const { ctx } = { ...this.layers["graphic"]};

        data.forEach((d) => {
            const { startAngle, endAngle, info } = { ...d };
            const angle = endAngle - startAngle;
            const radian = startAngle + angle / 2;
            const dataLabel = this.#getDataLabelText(info);
            
            const rr = r + 5;
            const tx = Math.cos(radian) * rr + x;
            const ty = Math.sin(radian) * rr + y;
            const position = this.#toDegree(radian) > 180 ? "lc" : "rc";
            const text = util.CanvasUtil.text(tx, ty, dataLabel, "fill", dataLabelStyles);
            text.draw(ctx, position);
        });
    }

    #getDataLabelText(data) {
        const { name, value, ratio } = { ...data }

        const text = `${name}`;
        return text
    }

    getTooltipContent(e, x, y) {
        const bool = this.#isInPie(x, y);
        const data = bool === true ? this.#getCoorData(x, y) : "";
        const { ctx } = { ...this.layers["hover"]};

        let html;
        this.clear("hover");
        if (data && ctx) {
            data.draw(ctx, 1, { fillStyle: "#FFF" });
            data.draw(ctx, 1, { globalAlpha: 0.7 });

            html = data ? this.#getTooltipHtml(data) : "";
        }

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

    #toDegree(radian) {
        const startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        const degree = (radian - startAngle) * 180 / Math.PI;
        return degree;
    }

    #getDegree(mx, my) {
        const { x, y } = { ...this.chartData };
        const startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        const radian = (Math.atan2(my - y, mx - x) - startAngle) * 180 / Math.PI;
        const degree = radian < 0 ? radian + 360 : radian;

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
