import Chart from "./Chart.js";
import * as util from "../util/Utils.js";

const color = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#000080", "#6A0DAD"];
class PieChart extends Chart {
    #info;

    initOption() {
        const option = {
            chart: {
                startAngle: -Math.PI / 2,
                scale: 0.9
            }
        };

        return option;
    }

    parseOption(param) {
        return param;
    }

    /**
     * 현 차트를 그리기 위한 데이터로 파싱하는 함수
     * @param {Array} data 전처리 이전 데이터
     * @returns 차트에 사용할 파싱 데이터
     */
    parseChartData(data) {
        const totalCount = data.reduce((acc, val) => acc += Number(val.value), 0);
        const parseData = [];
        const startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        let tmpAngle = startAngle;
        data.sort((a, b) => (a.value < b.value)).forEach((d, idx) => {
            const { name, value } = { ...d };
            const ratio = util.CommonUtil.round(value / totalCount, 5);
            const stAngle = tmpAngle;
            const angle = Math.PI * 2 * ratio;
            tmpAngle = stAngle + angle;
            const tmp = {
                name: name,
                value: value,
                ratio: ratio,
                st: stAngle,
                ag: angle,
                degree: {
                    st: (stAngle - startAngle) * 180 / Math.PI,
                    ed: (stAngle + angle - startAngle) * 180 / Math.PI
                },
                index: idx
            };
            parseData.push(tmp);
        });

        const chartData = {
            total: totalCount,
            data: parseData
        };

        return chartData;
    }

    /**
     * wrapping 함수
     */
    draw() {
        this.drawChart();
    }

    /**
     * 각 데이터의 비율 및 theta 값을 가져와 여러 조각을 일제히 그리게 함
     * @param {Boolean} useAnimation 에니메이션 사용 여부
     * @param {Object} option 단발성으로 사용할 옵션
     */
    drawChart(useAnimation = true, option) {
        option = util.CommonUtil.shallowMerge(option, this.option);

        const { data } = { ...this.chartData };
        const { pie, label, animation: { type, speed } } = { ...option };
        const scale = util.CommonUtil.find(this.option, "chart.scale", 0.9);
        const { all: commonPieOption } = { ...pie };

        const animation = util.AnimationUtil.getAnimation(type, speed, useAnimation);

        const canvasRect = util.StyleUtil.getBoundingClientRect(this.builder.canvas);
        const { width, height } = canvasRect;
        const _width = width;
        let size = _width > height ? height : _width;
        size = size / 2 * scale;
        const point = [_width / 2, height / 2];

        const fn = () => {
            this.clear();
            const progressRate = animation.shift();

            data.forEach((d, idx) => {
                const { st, ag } = { ...d };
                const _pieOption = util.CommonUtil.find(pie, `${idx}`);
				const { mag = 1, ...pieOption } = { ..._pieOption };
                const opt = { ...commonPieOption, ...pieOption };
                this.builder.arc(point, size * mag, [st, st + ag * progressRate], "fill", { style: { fillStyle: color[idx], ...opt } });
            });

            if (util.CommonUtil.isEmpty(animation)) {
                const [x, y] = [...point];
                this.#info = { x: x, y: y, r: size };
                this.drawDataLabel(data, label);
                window.cancelAnimationFrame(fn);
            } else {
                window.requestAnimationFrame(fn);
            }
        }

        window.requestAnimationFrame(fn);
    }

    /**
     * 파이의 조각 위에 데이터 라벨을 그리는 함수
     * @param {Array} data 차트를 그리기 위한 파싱이 완료된 데이터
     * @param {Object} option 추가 옵션
     */
    drawDataLabel(data = [], option) {
        const { x, y, r } = { ...this.#info };
        const { all } = { ...option };

        data.forEach((d, idx) => {
            const { name, value, ratio, st, ag } = { ...d };

            if (ratio < 0.05) return;

            const labelOption = util.CommonUtil.find(option, `${idx}`);
            const opt = { ...all, ...labelOption };

            const text = this.getDataLabelText(d);
            const fSize = this.builder.getTextSize(text, opt);
            const { width: fw, height: fh } = { ...fSize };

            const tmp = st + ag / 2;
            const tx = Math.cos(tmp) * r * 0.7 + x - (fw / 2);
            const ty = Math.sin(tmp) * r * 0.7 + y - (fh / 2);
            
            this.builder.text(text, [tx, ty], "stroke", opt);
        });
    }

    /**
     * 파이 조각 위에 표현할 문자열을 반환하는 함수
     * @param {Object} data 파이 조각 하나에 대한 파싱된 데이터
     * @returns 데이터 라벨 문자열
     */
    getDataLabelText(data) {
        const { name, value, ratio = 0} = { ...data };
        return `${name}`;
    }

    drawPiece(data, option) {
        const { x, y, r } = { ...this.#info };
        const { index, st, ag } = { ...data };
        const point = [x, y];

        const text = this.getDataLabelText(data);
        const fSize = this.builder.getTextSize(text);
        const { width: fw, height: fh } = { ...fSize };

        const tmp = st + ag / 2;
        const tx = Math.cos(tmp) * r * 0.7 + x - (fw / 2);
        const ty = Math.sin(tmp) * r * 0.7 + y - (fh / 2);

        this.builder.arc(point, r, [st, st + ag], "fill", { fillStyle: color[index], ...option });
        this.builder.text(text, [tx, ty]);
    }

    drawDataLegend() {
        const canvas = this.builder.canvas;
        const height = canvas.height;
        const width = canvas.width;

        const x = width * 0.8;
        this.builder.lines([
            [x, 0],
            [x, height]
        ], "stroke", { strokeStyle: "black"} );
    }

    /**
     * x, y 좌표를 통하여 파이 내부인지 확인 후 툴팁에 그릴 내용을 반환하는 함수
     * @param {PointerEvent} e MouseMove에서 발생한 이벤트
     * @param {Number} x 마우스 커서의 x 좌표
     * @param {Number} y 마우스 커서의 y 좌표
     * @returns 툴팁 내용
     */
    setTooltipContent(e, x, y) {
        let html;

        if (this.#checkInPie(x, y)) {
            const data = this.#getTooltipData(x, y);
            const { name, value, ratio, index } = { ...data };
            const { name: oName } = { ...this._old };
            const percentage = (ratio * 100).toFixed(1);

            html = `<div>
                        <span>${name}</span>
                        <span>${value}</span>
                        <span>${percentage}%</span>
                    </div>`;
            
            if (name !== oName) {
                const option = {
                    pie : {
                        [`${index}`]: {
                            fillStyle: `rgba(${util.StyleUtil.getHexColorToDecimal(color[index])}, 0.6)`,
							mag: 1.05
                        }
                    }
                };
                this.drawChart(false, option);
                this._old = data;
            }
        } else {
            if (this._old) {
                this.drawChart(false);
                this._old = null;
            }
        }

        return html
    }

    /**
     * x^2 + y^2 <= r^2 공식을 사용하여 마우스 커서가 파이 내부인지 확인하는 함수
     * 위 공식을 직접적으로 바로 호출하지 않고 사전에 단순 계산으로 분기 처리 이후 수행
     * @param {Number} x 마우스 커서 x 좌표
     * @param {Number} y 마우스 커서 y 좌표
     * @returns 파이 내부 여부 참거짓 값
     */
    #checkInPie(x, y) {
        const { x: _x, y: _y, r } = { ...this.#info };
        const gapX = Math.abs(x - _x);
        const gapY = Math.abs(y - _y);

        let result = false;
        if (gapX + gapY <= r) {
            result = true;
        } else if (gapX > r || gapY > r) {
        } else if (gapX ** 2 + gapY ** 2 <= r ** 2) {
            result = true;
        }

        return result;
    }

    /**
     * 커서가 존재하는 위치의 파싱 데이터를 반환하는 함수
     * @param {Number} x 마우스 커서 x 좌표
     * @param {Number} y 마우스 커서 y 좌표
     * @returns 커서 위치에 있는 데이터
     */
    #getTooltipData(x, y) {
        const degree = this.#getDegree(x, y);
        const { data: _data } = { ...this.chartData };
        const data = _data.find((d) => {
            const { degree: { st, ed } } = { ...d };
            return st <= degree && degree < ed;
        });

        return data;
    }

    /**
     * x, y 좌표와 파이가 그려진 중앙 좌표를 통해 12시 기준으로 radian을 반환하는 함수
     * @param {Number} x 마우스 커서 x 좌표
     * @param {Number} y 마우스 커서 y 좌표
     * @returns radian
     */
    #getDegree(x, y) {
        const { x: _x, y: _y } = { ...this.#info };
        const startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        const radian = (Math.atan2(y - _y, x - _x) - startAngle) * 180 / Math.PI;
        return radian < 0 ? radian + 360 : radian;
    }
}

export default PieChart;