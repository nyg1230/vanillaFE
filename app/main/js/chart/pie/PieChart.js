/* inherit */
import Chart from "main/chart/base/Chart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import option from "main/chart/option/PieOption.js";

class PieChart extends Chart {
    #oldIndex;
    #tooltipHTML;

    get option() {
        return option;
    }

    parseData() {
        const { data, chart, dataLabel, palette } = { ...this.data };
        const { startDegree } = { ...chart };
        const { style: dataLabelStyle } = { ...dataLabel };
        const total = Object.values(data).reduce((acc, val) => acc += val, 0);
        
        const [x, y, r] = this.#getXYR();

        const startRadian = this.#toRadian(startDegree);
        const parseChart = [];
        const parseDataLabel = [];
        let currentRadian = startRadian;

        Object.entries(data).forEach(([name, value], idx) => {
            const ratio = value / total;
            const angle = Math.PI * 2 * ratio;
            const endRadian = currentRadian + angle;
            const color = util.ColorUtil.getPaletteColor(palette, idx);
            // 파이 조각 하나
            const arcOption = {
                style: { fillStyle: color }
            };
            const arc = util.CanvasUtil.arc(x, y, r, currentRadian, endRadian, arcOption);
            const arcData = {
                ...arc,
                info: { name, value, ratio }
            }
            parseChart.push(arcData);

            // 데이터 라벨
            const d = { name, value, ratio };
            const centerRadian = currentRadian + (endRadian - currentRadian) / 2;
            const dl = this.#getDataLabel(d, x, y, r, centerRadian, startRadian);
            dl && parseDataLabel.push(dl);

            currentRadian = endRadian;
        });
        
        const chartData = {
            chart: parseChart,
            dataLabel: parseDataLabel,
            x,
            y,
            r
        };

        return chartData;
    }

    #getDataLabel(data, x, y, r, radian, startRadian) {
        const { dataLabel } = { ...this.data };
        const { position, param, minHideRatio = 0.05 } = { ...dataLabel };
        const { ratio } = { ...data };

        let dl;
        let tx;
        let ty;
        let option;
        if (ratio < minHideRatio) {
            return;
        } if (position === "inner") {
            tx = Math.cos(radian) * r / 2 + x;
            ty = Math.sin(radian) * r / 2 + y;
            option = {
                position: "cc"
            }
        } else if (position === "outter") {
            const corr = 3;
            r += corr;
            tx = Math.cos(radian) * r + x;
            ty = Math.sin(radian) * r + y;
            option = {
                position: this.#getDataLabelPosition(radian - startRadian)
            }
        } else {
            return;
        }

        const text = this.#getDataLabelText(data);
        param.option = { ...param.option, ...option };
        dl = util.CanvasUtil.text(tx, ty, text, param);

        return dl;
    }

    #getXYR() {
        const { chart } = { ...this.data };
        const { area, scale } = { ...chart };
        const { x, y, width, height } = { ...area };

        const centerX = width / 2 + x;
        const centerY = height / 2 + y;
        const r = Math.min(width, height) / 2 * scale / 100;

        return [centerX, centerY, r];
    }

    #toRadian(degree) {
        const dg = util.CommonUtil.modulo(degree, 360);
        let radian = dg / 180 * Math.PI;
        radian = radian < Math.PI ? radian : radian - 2 * Math.PI;
        return radian;
    }

    #toDegree(radian) {
        return radian / Math.PI * 180;
    }

    #getDataLabelText(data) {
        return util.CommonUtil.find(data, "name");
    }

    #getDataLabelPosition(radian) {
        let degree = this.#toDegree(radian);
        degree = util.CommonUtil.modulo(degree, 360);

        let position;
        if (degree > 270) {
            position = "lt";
        } else if (degree > 180) {
            position = "lb";
        } else if (degree > 90) {
            position = "rb";
        } else {
            position = "rt";
        }

        return position;
    }

    draw() {
        this.#drawChart();
    }

    #drawChart() {
        const { chart, dataLabel } = { ...this.chartData };
        const { canvas, ctx } = { ...this.mainLayer };

        const { animate, tooltip } = { ...this.data };
        const { use = true, delay: _delay = 1000 } = { ...animate };
        const delay = use === true ? _delay : 1;
        const aniFn = util.AnimateUtil.getFunction("");

        const start = performance.now();
        const fn = (t) => {
            util.CanvasUtil.clear(canvas);
            let ratio = (t - start) / delay;
            ratio = ratio < 1 ? ratio : 1;
            const progress = aniFn(ratio);
            
            this.drawTitle(ctx);
            chart.forEach((c) => {
                c.draw(ctx, progress);
            });

            if (ratio < 1) {
                window.requestAnimationFrame(fn);
            } else {
                window.cancelAnimationFrame(fn);
                this.#drawDataLabel(ctx);
                util.EventUtil.dispatchEvent(this.container, NMConst.eventName.CHART_DRAW_COMPLETE, { tooltip: tooltip.use });
            }
        };

        window.requestAnimationFrame(fn);
    }

    #drawDataLabel(ctx) {
        const { dataLabel } = { ...this.chartData };
        dataLabel.forEach((dl) => {
            dl.draw(ctx);
        });
    }

    /* tooltip start */
    getTooltipHTML(mx, my, e) {
        const isContain = this.#isContainPie(mx, my);
        const { canvas, ctx } = { ...this.subLayer };

        let html;
        if (isContain === true) {
            const idx = this.#getDataIndex(mx, my);
            
            if (this.#oldIndex !== idx) {
                this.#oldIndex = idx;
                const data = util.CommonUtil.find(this.chartData, `chart.${idx}`);
                
                util.CanvasUtil.clear(canvas);
                this.#setDim(ctx, data, idx);
                this.#tooltipHTML = this.#getTooltipHTML(data);
            }

            html = this.#tooltipHTML;
        } else {
            if (this.#oldIndex >= 0) {
                util.CanvasUtil.clear(canvas);
                this.#oldIndex = null;
                this.#tooltipHTML = null;
            }
        }
        
        return html;
    }

    #setDim(ctx, target, idx) {
        target.draw(ctx, 1, { style: { fillStyle: "white" } });
        target.draw(ctx, 1, { style: { globalAlpha: 0.6 } });

        const position = util.CommonUtil.find(this.data, "dataLabel.position");

        if (position === "inner") {
            const { dataLabel } = { ...this.chartData };
            dataLabel.forEach((d) => {
                d.draw(ctx);
            });
        }
    }

    #getTooltipHTML(data) {
        const { info } = { ...data };
        const { name, value, ratio } = { ...info };
        const vRatio = util.CommonUtil.round(ratio * 100, 2);
        const html = `<div>${name} ${value} ${vRatio}%</div>`;

        return html;
    }

    #isContainPie(mx, my) {
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

    #getDataIndex(mx, my) {
        const { chart } = { ...this.chartData };
        const radian = this.#getRadian(mx, my);
        const idx = chart.findIndex((c) => {
            const { startAngle, endAngle } = { ...c };
            return startAngle <= radian && endAngle > radian
        });

        return idx;
    }

    #getRadian(mx, my) {
        const { x, y } = { ...this.chartData };
        const startDegree = util.CommonUtil.find(this.data, "chart.startDegree");
        const startRadian = this.#toRadian(startDegree);
        let radian = Math.atan2(my - y, mx - x);
        radian = radian >= startRadian ? radian : radian + Math.PI * 2;
        return radian;
    }
    /* tooltip end */
}

export default PieChart;
