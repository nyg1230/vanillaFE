/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import { NMChart } from "js/core/components/chart/NMChart";
/* model */
import NMAccountModel from "js/custom/model/account/NMAccountModel.js";
/* intent */
import accountIntent from "js/custom/intent/account/NMAccountIntent";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
import { collection } from "js/config/data/collection";

const weeklyLimit = 10;

export default class NMHome extends NMView {
    modelList = [NMAccountModel];

    static get name() {
        return "nm-home";
    }

    get clsName() {
        return NMHome.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .chart-area {
                height: 100%;
                display: grid;
                height: 100%;
                grid-template:
                    "a a a a a"
                    "b b c c c"
                    "d d d d d"
                ;

                & > div {
                    border: 1px solid gray;
                }

                & .title-area {
                    grid-area;
                    height: fit-content;
                }

                & .period-status-area {
                    grid-area: a;
                }

                & .spending-ratio-area {
                    grid-area: b;
                }

                & .specific-spending-area {
                    grid-area: c;
                }

                & .recent-account-list {
                    grid-area: d;
                }

                & nm-chart {
                    display: block;
                    height: 100%;
                    width: 100%;
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <div class="title-area">
                <nm-label class="" value="최근 30일 통계"></nm-label>
            </div>
            <div class="chart-area">
                <!-- 총 지출 현황 지정 년도 또는 월 -->
                <div class="period-status-area">
                    <nm-chart class="period-status"></nm-chart>
                </div>

                <!-- 해당 기간 내 총 지출 비율 -->
                <div class="spending-ratio-area">
                    <nm-chart class="spending-ratio"></nm-chart>
                </div>

                <!-- 파이 클릭 시 연동되어 보이는 차트 -->
                <div class="specific-spending-area">
                    <nm-chart class="specific-spending"></nm-chart>
                </div>

                <!-- 최근 등록한 가계부 간이 목록 -->
                <div class="recent-account-list"></div>
            </div>
        </div>`;
    }

    get #dateParam() {
        const now = new Date();
        let past = now - util.DateUtil.converTimeStamp(30, "d", "ms");
        past = new Date(past);

        return {
            start_date: util.DateUtil.dateToFormatString(past, "$Y-$M-$d"),
            end_date: util.DateUtil.dateToFormatString(now, "$Y-$M-$d"),
            exclude: ["income"]
        }
    }

    afterRender() {
        super.afterRender();
        this.#getPeriodData();
        this.#getPeriodCategoryData();
    }

    onModelChange(e) {
        const { detail } = e;
        const { name, property, data } = detail;

        if (name === NMAccountModel.name) {
            const { data: d } = data;

            if (property === "periodData") {
                this.#parseDataByPeriod(d);
            } else if (property === "periodCategoryData") {
                this.#parseDataByCategory(d);
            }
        }
    }

    #getPeriodData() {
        accountIntent.getPeriodData(this.#dateParam);
    }

    #getPeriodCategoryData() {
        accountIntent.getPeriodCategoryData(this.#dateParam);
    }

    #parseDataByPeriod(data) {}

    #parseDataByCategory(data) {
        const all = data.reduce((acc, v) => acc + parseInt(v.total), 0);
        const parsed = data.map((d) => {
            const { category, total } = { ...d };
            const info = collection.category.find((d) => category === d.value);

            return {
                title: util.TranslateUtil.translate(info.title, "account"),
                value: parseInt(total)
            };
        });

        this.setSpendingRatio(parsed);
    }

    setSpendingRatio(data) {
        const param = {
            palette: "2024",
            header: {},
            dataLabel: {},
            data: [
                {
                    type: "pie",
                    list: data
                }
            ]
        };
        const chart = util.DomUtil.querySelector(this, ".spending-ratio");
        chart.$data = param;
    }
}

define(NMHome);