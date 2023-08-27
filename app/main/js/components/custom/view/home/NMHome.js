/* inherit */
import { NMView, define } from "main/components/core/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
import NMChart from "main/components/core/chart/NMChart.js";
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";


export default class NMHome extends NMView {
    modelList = [];

    static get name() {
        return "nm-home";
    }

    get clsName() {
        return NMHome.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-areas:
                    "col col col"
                    "pie com com"
                    "rec rec rec"
                    "tag tag tag";
                grid-template-columns: "";
                grid-template-rows:
                    minmax(25vh, min-content)
                    minmax(20vh, min-content)
                    minmax(0, min-content)
                    minmax(0, min-content);
            }

            @media screen and (max-width: 860px) {
                .${this.clsName} {
                    grid-template-areas: "col" "pie" "com" "rec" "tag";
                    grid-template-columns: minmax(0, 100vw);
                    grid-template-rows: repeat(auto-fill, minmax(200px, max-content));
                }
            }

            .${this.clsName} > div {
                // border: 1px solid black;
            }

            .column-chart-area {
                grid-area: col;
            }

            .pie-chart-area {
                grid-area: pie;
            }

            .commit-list {
                grid-area: com;
            }

            .recent-list-area {
                grid-area: rec;
            }

            .tag-list-area {
                grid-area: tag;
            }

        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <div class="column-chart-area">
                <nm-chart class="column-chart commit-count-chart"></nm-chart>
            </div>
            <div class="pie-chart-area">
                <nm-chart class="pie-chart commit-kind-chart"></nm-chart>
            </div>
            <div class="commit-list">
                커밋 리스트
            </div>
            <div class="recent-list-area">
                최근 목록 리스트
            </div>
            <div class="tag-list-area">
                태그 리스트
            </div>
        </div>
        `;
    }

    addEvent() {}

    afterRender() {
        this.setColumnChart();
        this.setPieChart();
    }

    setColumnChart() {
        const columnChart = util.DomUtil.querySelector(this, ".column-chart");
        try {
            const data = {
                palette: "pantone",
                type: "column",
                title: {
                    text: "주간 커밋 횟수"
                },
                axis: {
                    x: {
                        title: {
                            text: "커밋 주차"
                        }
                    },
                    y: {
                        title: {
                            text: "횟수"
                        }
                    }
                },
                data: [
                    {
                        "1주차": 10,
                        "2주차": 15,
                        "3주차": 15,
                        "4주차": 7,
                        "5주차": 9,
                        "6주차": 4,
                        "7주차": 10,
                        "8주차": 15,
                        "9주차": 15,
                        "10주차": 7,
                        "11주차": 9,
                        "12주차": 4
                    },
                    {
                        "1주차": 7,
                        "2주차": 9,
                        "3주차": 2,
                        "4주차": 7,
                        "5주차": 3,
                        "6주차": 0,
                        "7주차": 7,
                        "8주차": 9,
                        "9주차": 2,
                        "10주차": 7,
                        "11주차": 3,
                        "12주차": 0
                    },
                    {
                        "1주차": 20,
                        "2주차": 3,
                        "3주차": 30,
                        "4주차": 7,
                        "5주차": 15,
                        "6주차": 6,
                        "7주차": 20,
                        "8주차": 3,
                        "9주차": 30,
                        "10주차": 7,
                        "11주차": 15,
                        "12주차": 6
                    }
                ]
            };
            columnChart.setChart(data);
            columnChart.draw();
        } catch (e) {
            console.log(e);
        };
    }

    setPieChart() {
        const pieChart = util.DomUtil.querySelector(this, ".pie-chart");

        try {
            const data = {
                palette: "pantone",
                type: "pie",
                title: {
                    text: "언어별 커밋량"
                },
                data: {
                    javascript: 5000,
                    html: 350,
                    css: 100
                }
            };
            pieChart.setChart(data);
            pieChart.draw();
        } catch(e) {
            console.log(e);
        }
    }
}

define(NMHome);