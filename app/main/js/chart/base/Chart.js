/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import CommonOption from "main/chart/option/CommonOption.js";

/**
 * 차후 컨테이너만 받고 캔버스를 붙히는 방식 고려하기
 */
class Chart {
    #data;
    #chartData;
    #container;
    #mainLayer;
    #subLayer;

    constructor(mainLayer, subLayer, container) {
        this.#mainLayer = mainLayer;
        this.#subLayer = subLayer;
        this.#container = container;
    }

    get container() {
        return this.#container;
    }

    get data() {
        return this.#data;
    }

    get chartData() {
        return this.#chartData;
    }

    get mainLayer() {
        return this.#mainLayer;
    }

    get subLayer() {
        return this.#subLayer;
    }

    get option() {
        return {};
    }

    setting(p) {
        window.qqq = this;
        this.#data = util.CommonUtil.shallowMerge(CommonOption, this.option, p);
        this.#parseData();
    }

    #parseData() {
        const title = this.#setTitle();
        this.#chartData = this.parseData();
        this.#chartData.title = title;
    }

    parseData() {
        return {};
    }

    #setTitle() {
        const { title } = { ...this.#data };
        const { text, style } = { ...title };
        
        !this.#data.chart && (this.#data.chart = {});
        const { rect: mainRect } = { ...this.#mainLayer };
        const { width, height } = mainRect;
        const area = { x: 0, y: 0, width: width, height: height };
        let titleText;

        if (util.CommonUtil.isNotEmpty(text)) {
            const mtx = util.CanvasUtil.getTextSize(text, style);
            let tHeight = util.CommonUtil.ceil(mtx.height, 0);
            tHeight += 10;
            area.y = tHeight;
            area.height = height - tHeight;

            const param = {
                style,
                option: { position: "cc" }
            }
            titleText = util.CanvasUtil.text(width / 2, tHeight / 2, text, param);
        }

        this.#data.chart.area = area;
        
        return titleText;
    }

    drawTitle(ctx) {
        const { title } = { ...this.chartData };
        title && title.draw(ctx);
    }

    draw() {}

    drawChart() {}

    drawDatalabel() {}

    clear() {}

    getTooltipHTML() {}
}

export default Chart;
