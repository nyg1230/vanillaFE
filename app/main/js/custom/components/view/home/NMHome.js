/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMChartModel from "js/custom/model/chart/NMChartModel.js";
/* intent */
import chartIntent from "js/custom/intent/chart/NMChartIntent.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const weeklyLimit = 10;

export default class NMHome extends NMView {
    modelList = [NMChartModel];

    static get name() {
        return "nm-home";
    }

    get clsName() {
        return NMHome.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: grid;
                height: 100%;
                grid-template: 
                    "a a a a a"
                    "b b c c c"
                    "d d d d d"
                ;

                & > div {
                    border: 1px solid black;
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
        <div class="${this.clsName} test-border" part="${this.clsName}">
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
        </div>`;
    }

    afterRender() {
        super.afterRender();
        this.getSpendingRatio();
    }

    onModelChange(e) {
        const { detail } = e;
        const { name, property, data } = detail;

        if (name === NMChartModel.name) {
            if (property === "spendingRatio") {
                this.setSpendingRatio(data);
            }
        }
    }

    getSpendingRatio() {
        chartIntent.getSpendingRatio();
    }

    setSpendingRatio(data) {
        const { list } = data;
        console.log(list);

        const param = {
            palette: "pantone",
            header: {},
            dataLabel: {},
            data: list
        };

        const chart = util.DomUtil.querySelector(this, ".spending-ratio");
        chart.data = param;
    }
}

define(NMHome);