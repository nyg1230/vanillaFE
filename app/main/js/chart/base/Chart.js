/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import CommonOption from "main/chart/option/CommonOption.js";

class Chart {
    #data;
    #chartData;
    #mainLayer;
    #subLayer;

    constructor(mainLayer, subLayer) {
        this.#mainLayer = mainLayer;
        this.#subLayer = subLayer;
    }

    get data() {
        return this.#data;
    }

    get chartData() {
        return this.#chartData;
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
        this.#setTitle();
        this.parseData();    
    }

    parseData() {}

    #setTitle() {
        const { title } = { ...this.#data };
        const { text, styles } = { ...title };
        
        !this.#data.chart && (this.#data.chart = {});
        const { rect: mainRect } = { ...this.#mainLayer };
        const { width, height } = mainRect;
        const area = { x: 0, y: 0, width: width, height: 0 };

        if (util.CommonUtil.isNotEmpty(text)) {
            const mtx = util.CanvasUtil.getTextSize(text, styles);
            const tHeight = util.CommonUtil.ceil(mtx.height, 0);

            area.y = tHeight;
            area.height = height - tHeight;
        }

        this.#data.chart.area = area;
    }

    draw() {}

    clear() {}
}

export default Chart;
