import CanvasUtil from "../util/CanvasUtil.js";
import * as util from "../util/Utils.js";

class Chart {
    #container;
    #builder;
    #data;
    #chartData;
    #isDraw = false;
    #tooltip;
    #option;
    #commonOption;
    #observer;

    constructor(target, data, options) {
        this.#container = target;
        this.#builder = CanvasUtil.init(this.#container, options);
        this.#data = data;
        this.#init();
    }

    get container() {
        return this.#container;
    }

    get builder() {
        return this.#builder;
    }

    get data() {
        return this.#data;
    }

    get option() {
        return this.#option;
    }

    get chartData() {
        return this.#chartData;
    }

    /**
     * 실시간 감지를 할 요소 리스트
     */
    get #observerConfig() {
        return {
            attributeFilter: ["width", "height"]
        };
    }

    /**
     * 첫 생성시 기본 실행하는 함수
     * 데이터를 포함하여 생성 시 즉시 차트를 그리기 시작함
     */
    #init() {
        this.#initOption();
        if (util.CommonUtil.isNotEmpty(this.data)) {
            this.#parseOption();
            this.#parseChartData();
        }
        this.#addObserver();
    }

    /**
     * 기초 옵션을 설정하는 함수
     */
    initOption() {}
    #initOption() {
        const option = {
            animation: {
                type: "rapidly",
                speed: "normal"
            }
        };
        this.#commonOption = util.CommonUtil.shallowMerge(option, this.initOption());
    }

    /**
     * 외부에서 받은 변수를 파싱하여 반환하는 함수
     * 반환된 값은 기초 옵션과 병합됨
     * @param {Object} param 기초 옵션과 병합할 옵션
     * @returns 처리 후 병합할 옵션
     */
    parseOption(param) {
        return {};
    }
    #parseOption(param) {
        if (util.CommonUtil.isNull(param)) {
            this.#option = this.#commonOption
        } else {
            this.#option = util.CommonUtil.shallowMerge(this.#commonOption, this.parseOption(param));
        }
    }

    /**
     * 외부에서 받은 데이터를 차트를 그릴 수 있게 변환 작업하는 함수
     * 외부 데이터는 차트마다 일정한 형태가 정해져 있음
     * @param {Object} data 차트에 사용할 전처리 이전 데이터
     * @returns 차트를 그릴 수 있게 파싱된 값
     */
    parseChartData(data) {
        return {};
    }
    #parseChartData() {
        this.#chartData = this.parseChartData(this.#data, this.#option);
        this.#isDraw = false;
        this.#draw();
    }

    /**
     * 차트를 그리는 함수
     * 사전에 전처리한 데이터를 사용하여 차트가 렌더링함
     */
    draw() {}
    #draw() {
        if (this.#draw !== true) {
            this.clear();
            this.draw();
            this.#setTooltip();
            this.#isDraw = true;
        }
    }

    /**
     * attribute를 실시간 감지하여 감지된 요소에 맞게 특정 행동을 함
     * width, height를 감지하여 차트를 새로 그리게 함
     */
    #addObserver() {
        if (this.#observer) return;

        const callback = (ml) => {
            for (const m of ml) {
                const { type, attributeName } = m;

                if (type === "attributes") {
                    if (this.#observerConfig.attributeFilter.includes(attributeName)) {
                        this.refresh();
                    }
                }
            }
        }

        this.#observer = new MutationObserver(callback);
        this.#observer.observe(this.#builder.canvas, this.#observerConfig);
    }

    /**
     * 외부 데이터를 직접 주입하여 파싱할 수 있는 함수
     * @param {Object} param 차트를 그리기 위한 외부 데이터
     */
    setChartData(param) {
        const { data, option } = { ...param };
        this.#data = data;
        this.#parseOption(option);
        this.#parseChartData();
    }

    /**
     * 툴팁을 설정하는 함수
     */
    #setTooltip() {
        const canvas = this.#builder.canvas;
        this.#tooltip = util.TooltipUtil.setTooltip(canvas, this.#setTooltipContent.bind(this));
    }

    /**
     * move를 통해 마우스가 이동함에 따라 해당 위치에서 툴팁을 발생할 지 반환하는 함수
     * @param {PointerEvent} e 마우스 move시 발생하는 이벤트
     * @returns 차트에 표현될 문자열, html도 가능
     */
    setTooltipContent(e) {
        return;
    }
    #setTooltipContent(e) {
        const content = this.setTooltipContent(e, ...this.#getXY(e));
        return content;
    }

    /**
     * 마우스 커서가 현재 존재하는 x, y축을 반환하는 함수
     * @param {PointerEvent} e MouseMove를 통해 얻은 이벤트
     * @returns 커서 좌표 [x, y]
     */
    #getXY(e) {
        const rect = this.#builder.canvas.getBoundingClientRect();
        const { left, top } = rect;
        const { clientX, clientY } = e;
        const x = clientX - left;
        const y = clientY - top;

        return [x, y];
    }

    /**
     * 별도의 조정없이 다시 차트를 그리는 함수
     */
    refresh() {
        this.#draw();
    }

    /**
     * 차트를 완전히 지우는 함수
     */
    clear() {
        this.#builder.clear();
    }
}

export default Chart;