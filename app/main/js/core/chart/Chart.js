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

const chartTypes = {
    pie: ["pie"],
    axisColumn: ["column", "line"],
    axisColumnStack: ["columnStack"]
};

const padding = 8;

class Chart {
    #originData;
    #data;
    #container;
    #charts;
    #area;
    #layer = {};
    #draw = {};
    #tooltip;
    #chartType;

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

        this.#chartType = this.getChartType();

        if (this.isAxisChart()) {
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

        this.#layer.mainLayer = {
            canvas: mainLayer,
            ctx: mainLayer.getContext("2d")
        };

        this.#layer.overLayer = {
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

        const { canvas, ctx } = this.#layer.overLayer;
        util.CanvasUtil.clear(canvas);

        this.#charts.forEach((chart, type) => {
            const content = chart.getTooltip(stX, stY, ctx, e);
            content && (html += content);
        });

        return html;
    }

    parseData() {
        const { data = [], ...other } = this.#data;

        if (this.isAxisChart("axis")) {
            this.parseAxisData();
        }

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

    getChartType() {
        const { data = [] } = this.#data;
        const types = new Set(data.map((d) => d.type));
        const entry = Object.entries(chartTypes);
        const len = entry.length;

        let result = "";
        for (let idx = 0; idx < len; idx++) {
            const [type, list] = entry[idx];

            if ([...types].every((t) => list.some(l => l === t))) {
                result = type;
                break;
            }
        }

        return result;
    }

    isAxisChart() {
        return this.#chartType.startsWith("axis");
    }

    parseAxisData() {
        const { data = [], axis = {} } = this.#data;
        const { x, ly, ry } = axis;
        const xTickList = new Set();

        data.forEach((d) => {
            const { axis, list = [] } = d;
            const axisType = axis === "r" ? "ly" : "ly";
            const info = util.CommonUtil.find(this.#data, `axis.${axisType}.info`);
            
            list.forEach((l) => {
                const { title, value } = l;
                info.max = Math.max(info.max, value);
                info.min = Math.min(info.min, value);
                xTickList.add(title);
            });

            info.min = 0;
        });

        x.label.list = [...xTickList];

        if (this.hasAxisLY()) {
            const { mark, info } = ly;
            const { major = {}, minor = {} } = mark;
            let { min, max } = info;
            max = util.CommonUtil.ceil(max, -`${max}`.length + 1)
            info.max = max;

            if (major.value <= 0) {
                const pow = `${max}`.length - 1;
                const refValue = 5 * 10 ** pow;
                const value = max < refValue ? 5 * 10 ** (pow - 1) : 10 ** pow;
                major.value = value;
            }

            if (minor.enable && minor.value <= 0) {
                minor.value = major.value / 5;
            }
        }
    }

    calcArea() {
        const { canvas } = { ...this.#layer.mainLayer };
        const rect = util.StyleUtil.getBoundingClientRect(canvas, null, true);
        const { width, height } = rect;
        this.#area = {
            layer: { x: 0, y: 0, width, height },
            header: { x: 0, y: 0, width: 0, height: 0 },
            legend: { x: 0, y: 0, width: 0, height: 0 },
            chart: { x: 0, y: 0, width: 0, height: 0 }
        };

        this.setHeader();
        this.setLegend();
        this.setChart();

        if (this.isAxisChart()) {
            const { chart } = this.#area;
            chart.x += padding;
            chart.width -= padding * 2;
            chart.height -= padding;
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
        headerArea.height = (height + padding * 2);

        const { width: hw, height: hh } = headerArea;

        this.#draw.header = util.CanvasUtil.text(hw / 2, hh / 2, title, { style, option: { position: "cc"} });
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
        this.calcAxisArea();
        this.#draw.axis = {};
        this.setAxisX();
        this.setAxisLY();
        this.setAxisRY();
    }

    hasAxisLY() {
        const { data = [] } = this.data;
        return data.some((d) => d.type !== "r");
    }

    hasAxisRY() {
        const { data = [] } = this.data;
        return data.some((d) => d.type === "r");
    }

    calcAxisArea() {
        const { axis = {}, data } = this.#data;
        const { chart = {} } = this.#area;

        const calcX = () => {
            const { title, label } = axis.x;
            const titleSize = util.CanvasUtil.getTextSize(title.text, title.param);
            const labelSize = util.CanvasUtil.getTextSize("Pq", label.param);

            chart.height -= (titleSize.height + labelSize.height + padding * 2);
        };

        const calcLY = () => {
            // 좌측 y축이 없는 경우 미계산
            if (!this.hasAxisLY()) return;

            const { title, label, info } = axis.ly;
            const { prefix = "", suffix = "" } = label;
            const { max } = info;
            const labelText = `${prefix}${max}${suffix}`

            const titleSize = util.CanvasUtil.getTextSize(title.text, title.param);
            const labelSize = util.CanvasUtil.getTextSize(labelText, label.param);

            const width = titleSize.height + labelSize.width + padding * 2;
            chart.x += width;
            chart.width -= width;
        };

        const calcRY = () => {
            if (!this.hasAxisRY()) return;
        };

        calcX();
        calcLY();
        calcRY();

        const labelX = util.CommonUtil.find(axis, "x.label", {});
        labelX.width = util.CommonUtil.round(chart.width / labelX.list.length, 12);

        if (this.hasAxisLY()) {
            const { ly } = axis;
            ly.enable = true;
            const { info, mark } = ly;
            const { min, max } = info;
            const { major, minor } = mark;
            const total = Math.abs(max - min);
            let tickCount = util.CommonUtil.ceil(total / major.value);
            tickCount = tickCount > 0 ? tickCount : 1;
            major.height = util.CommonUtil.round(chart.height / tickCount, 12);
            major.count = tickCount + 1;

            if (minor.enable) {
            }
        }
    }

    setAxisX() {
        const { axis } = this.#draw;
        axis.x = { line: [], label: [], title: [] };
        const { line, label, title } = axis.x;

        const { chart } = this.#area;
        const { x, y, width, height } = chart;

        // x axis start
        const stX = x;
        const stY = y + height;
        const edX = x + width
        const edY = stY;
        const lineInfo = util.CommonUtil.find(this.#data, "axis.x.line");
        const { param: lineParam } = lineInfo;
        const lineX = util.CanvasUtil.line([[stX, stY], [edX, edY]], lineParam);
        line.push(lineX);
        // x axis end

        // x label start
        const labelInfo = util.CommonUtil.find(this.#data, "axis.x.label");
        const { list = [], width: tickWidth, param } = labelInfo;
        const labelY = stY + padding;

        list.forEach((name, idx) => {
            const str = util.CanvasUtil.getElipsisText(name, tickWidth, param);
            const x = stX + tickWidth * idx + tickWidth / 2;
            const text = util.CanvasUtil.text(x, labelY, str, param);
            label.push(text);
        })
        // x label end

        // x title start
        const titleInfo = util.CommonUtil.find(this.data, "axis.x.title", {});
        const { text: titleText, param: titleParam } = titleInfo;

        if (util.CommonUtil.isNotEmpty(titleText)) {
            const { layer, legend } = this.#area;

            const str = util.CanvasUtil.getElipsisText(titleText, width, titleParam);
            const titleSize = util.CanvasUtil.getTextSize(str, titleParam);

            const titleX = x + width / 2;
            const titleY = layer.height - legend.height - titleSize.height / 2 - padding;

            const text = util.CanvasUtil.text(titleX, titleY, str, titleParam);
            title.push(text);
        }
        // xtitle end
    }

    setAxisLY() {
        if (!this.hasAxisLY()) return;
        const { axis } = this.#draw;
        axis.ly = { line: [], label: [], title: [], scale: [] };
        const { line, label, title, scale } = axis.ly;

        const { chart } = this.#area;
        const { x, y, width, height } = chart;

        const ly = util.CommonUtil.find(this.#data, "axis.ly", {});
        const { line: lineInfo, title: titleInfo, mark, label: labelInfo, info } = ly;
        const { min, max } = info;

        // ly axis start
        const stX = x;
        const stY = y;
        const edX = stX;
        const edY = y + height;
        const { param: lineParam } = lineInfo;
        const lineLY = util.CanvasUtil.line([[stX, stY], [edX, edY]], lineParam);
        line.push(lineLY);
        // ly axis end

        // ly label start
        console.log("setAxisLY >>> ", labelInfo);
        console.log("mark >>> ", mark);
        const { param: labelParam } = labelInfo;
        const { major, minor } = mark;
        const { value: majorValue, count: majorCount } = major;
        const majorScaleWidth = 4;

        // major scale
        for (let idx = 0; idx < majorCount; idx++) {
            const scaleValue = major.value * idx;
            const scaleY = y + height - major.height * idx;
            const scaleLine = util.CanvasUtil.line([[x, scaleY], [x - majorScaleWidth, scaleY]]);
            scale.push(scaleLine);
            const scaleText = util.CanvasUtil.text(x - padding, scaleY, scaleValue, labelParam);
            label.push(scaleText);
        }

        // minor scale
        // ly label end

        // ly title start
        const { text: titleText, param: titleParam } = titleInfo;
        
        if (util.CommonUtil.isNotEmpty(titleText)) {
            const str = util.CanvasUtil.getElipsisText(titleText, height, titleParam);
            const titleSize = util.CanvasUtil.getTextSize(str, titleParam);

            const titleX = padding + titleSize.height / 2;
            const titleY = y + height / 2;
            const text = util.CanvasUtil.text(titleX, titleY, str, titleParam);
            title.push(text);
        }
        // ly title end
    }

    setAxisRY() {
        if (!this.hasAxisRY()) return;
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
        const { ctx, canvas } = this.#layer.mainLayer;
        util.CanvasUtil.clear(canvas);

        this.rednerHeader(ctx);
        this.renderLengend(ctx);

        this.#charts.forEach((chart) => {
            chart.draw(ctx, per);
        });

        if (this.isAxisChart()) {
            this.renderAxis(ctx);
        }
    }

    rednerHeader(ctx) {
        const { header } = { ...this.#draw };

        if (header) {
            header.draw(ctx);
        }
    }

    renderLengend(ctx) {}

    renderAxis(ctx) {
        const { axis = {} } = { ...this.#draw };
        Object.values(axis).forEach((d) => {
            Object.values(d).forEach((dd) => {
                dd.forEach((a) => a.draw(ctx));
            })
        });
    }

    refresh() {
        this.draw();
    }
}

export default Chart;
