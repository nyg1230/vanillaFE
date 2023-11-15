/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import charts from "js/core/chart/charts.js";
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
/* option */
import options from "js/core/chart/option/options.js";
import CommonOption from "js/core/chart/option/CommonOption.js";
import AxisOption from "js/core/chart/option/AxisOption.js";

const axisChart = ["column", "line", "columnStack"];
const padding = 4;

class Chart {
    #originData;
    #data;
    #container;
    #charts;
    #area;
    #mainLayer;
    #overLayer;
    #render = {};
    #tooltip;

    constructor(params) {
        const { container } = { ...params };
        this.#container = container;

        this.#init();
    }

    get data() {
        return this.#data;
    }

    set data(d) {
        this.#originData = d;
        this.#data = util.CommonUtil.shallowMerge(options.common, this.#originData);

        const opt = []
        if (this.isAxis()) {
            this.#data = util.CommonUtil.shallowMerge(options.axis, this.#data);
        }

        this.#charts = new Map();
        this.parseData();
    }

    #init() {
        const rect = util.StyleUtil.getBoundingClientRect(this.#container);
        const { width, height } = rect;
        const mainLayer = util.DomUtil.createElement("canvas", { className: "main-layer", width, height });
        const overLayer = util.DomUtil.createElement("canvas", { className: "over-layer", width, height });

        this.#mainLayer = {
            canvas: mainLayer,
            ctx: mainLayer.getContext("2d")
        };

        this.#overLayer = {
            canvas: overLayer,
            ctx: overLayer.getContext("2d")
        };

        this.#container.appendChild(mainLayer);
        this.#container.appendChild(overLayer);

        this.init();
    }

    init() {}

    #setTooltip() {
        this.#tooltip = util.TooltipUtil.setTooltip(this.#container, this.#getTooltipContent.bind(this));
    }

    #removeTooltip() {
        if (this.#tooltip) {
            this.#tooltip.destroy();
            this.#tooltip = null;
        }
    }

    #getTooltipContent(e) {
        let html = "";

        const { left, top } = util.StyleUtil.getBoundingClientRect(this.#container);
        const { clientX, clientY } = e;
        const stX = clientX - left;
        const stY = clientY - top;

        const { canvas, ctx } = this.#overLayer;
        util.CanvasUtil.clear(canvas);

        this.#charts.forEach((chart, type) => {
            const content = chart.getTooltip(stX, stY, ctx, e);
            content && (html += content);
        });

        return html;
    }

    parseData() {
        const { data = [], ...other } = this.#data;

        data.forEach((d) => {
            const { type, ...remain } = d;

            if (!this.#charts.has(type)) {
                const chart = new charts[type];
                chart.option = other;
                this.#charts.set(type, chart);
            }

            const chart = this.#charts.get(type);
            chart.add(remain);
        });

        this.calcArea();

        this.#charts.forEach((chart) => {
            chart.area = this.#area;
            chart.parse();
        });

        this.draw();
    }

    isAxis() {
        const { data = [] } = { ...this.#data };
        const result = data.some((d) => axisChart.includes(d.type));

        return result;
    }

    calcArea() {
        const { canvas } = { ...this.#mainLayer };
        const rect = util.StyleUtil.getBoundingClientRect(canvas, null, true);
        const { width, height } = rect;
        this.#area = {
            layer: { x: 0, y: 0, width, height },
            header: { x: 0, y: 0, width: 0, height: 0 },
            legend: { x: 0, y: 0, width: 0, height: 0 },
            axisX: { x: 0, y: 0, width: 0, height: padding },
            axisLY: { x: 0, y: 0, width: padding, height: 0 },
            axisRY: { x: 0, y: 0, width: padding, height: 0 },
            chart: { x: 0, y: 0, width: 0, height: 0 }
        };

        this.setHeader();
        this.setLegend();
        this.setChart();
        if (this.isAxis()) {
            this.setAxis();
        }
    }

    setHeader() {
        const { header = {} } = this.data;
        const { title, style, option } = header;

        if (util.CommonUtil.isEmpty(title)) return;

        const titleSize = util.CanvasUtil.getTextSize(title, { style });
        const { height } = titleSize;

        const { header: headerArea, layer } = this.#area;
        headerArea.width = layer.width;
        headerArea.height = (height + padding);

        const { width: hw, height: hh } = headerArea;

        this.#render.header = util.CanvasUtil.text(hw / 2, hh / 2 + padding, title, { style, option: { position: "cc"} });
    }

    setLegend() {}

    setChart() {
        const { layer, header, legend, chart } = this.#area;
        util.CommonUtil.deepMerge(chart, {
            y: header.height,
            width: layer.width,
            height: layer.height - header.height - legend.height
        });
    }
    
    setAxis() {
        /**
         * ly, ry minmax 구하기
         * ly, ry 라벨 구간 구해서 미리 더하기
         * major, minor mark value 정해진 값 없으면 가변 구간 구하기
         * x, ly, ry 축 타이틀 높이 구하기
         * 계산 순서
         *  ly, ry label 너비 계산
         *  x label 높이 계산
         *  x title 높이 계산
         *  ly, ry title 높이 계산
         *  다시 x label area를 통한 title 재계산
         *  변동사항이 있다면 다시 ly, ry title 계산
         *  변동사항이 연속해서 존재하면 사이즈가 맞을 때 까지 진행
         */
        this.calcAxisLabel();
        this.calcAxisY();
        this.setAxisLY();
        this.setAxisRY();
        this.setAxisX();
    }

    calcAxisY() {
        const { data } = { ...this.#data };

        const axisInfo = {
            ly: { list: new Set() },
            ry: { list: new Set() }
        };

        data.forEach((d) => {
            const { axis, list } = { ...d };

            
            const targetList = axis !== "r" ? axisInfo.ly.list : axisInfo.ry.list;
            
            list.forEach((l) => {
                targetList.add(l.value);
            });
        });

        Object.values(axisInfo).forEach((info) => {
            const { list } = info;
            const max = Math.max(...list);
            info.max = max;
        });
    }

    getLabelText(text, option, maxWidth = -1) {
        let result = text;
        if (maxWidth > 0) {
            const ttt = "...";
            let { width } = util.CanvasUtil.getTextSize(result, option);
            let w = width;
            let len = text.length;

            while (maxWidth < w) {
                if (len === 0) {
                    result = "";
                    break;
                }

                result = result.substring(0, --len);
                width = util.CanvasUtil.getTextSize(result, option).width;
            }
        }

        return result
    }

    calcAxisLabel() {
        const { data } = { ...this.#data };
        const hasAxisRY = data.every((d) => d.axis !== "r");
    }

    setAxisLY() {
        const axisLY = util.CommonUtil.find(this.#data, "axis.ly", {});
        const { data } = { ...this.#data };
        const hasAxisLY = data.some((d) => d.axis !== "r");

        if (!hasAxisLY) return;
        console.log("axisLY >>> ", axisLY);
    }

    setAxisRY() {
        const axisRY = util.CommonUtil.find(this.#data, "axis.ry", {});
        const { data } = { ...this.#data };
        const hasAxisRY = data.some((d) => d.axis === "r");

        if (!hasAxisRY) return;
        console.log("axisRY >>> ", axisRY);
    }

    setAxisX() {
        const axisX = util.CommonUtil.find(this.#data, "axis.x", {});
        console.log(axisX);
    }

    draw() {
        const { animate } = this.#data;
        const { enable: aniEnable, type, duration } = animate;
        const animateFunction = util.AnimateUtil.getFunction(type);
        const st = performance.now();
        const fn = (t) => {
            const gap = t - st;
            let per;

            if (!aniEnable) {
                per = 1;
            } else {
                per = gap / duration;
                per = per < 1 ? animateFunction(per) : 1;
            }

            this.excute(per);
            if (per === 1) {
                window.cancelAnimationFrame(fn);
                this.#setTooltip();
            } else {
                window.requestAnimationFrame(fn);
            }
        };

        this.#removeTooltip();
        window.requestAnimationFrame(fn);
    }

    excute(per) {
        const { ctx, canvas } = this.#mainLayer;
        util.CanvasUtil.clear(canvas);
        this.rednerHeader(ctx);
        this.renderLengend(ctx);
        this.renderAxis(ctx);

        this.#charts.forEach((chart) => {
            chart.draw(ctx, per);
        });
    }

    rednerHeader(ctx) {
        const { header } = { ...this.#render };

        if (header) {
            header.draw(ctx);
        }
    }

    renderLengend(ctx) {}

    renderAxis(ctx) {}

    refresh() {
        this.draw();
    }
}

export default Chart;
