/* inherit */
import { NMView, define } from "main/components/core/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
import NMChart from "main/components/core/chart/NMChart.js";
/* model */
import NMGithubModel from "main/model/custom/NMGithubModel.js";
/* intent */
import githubIntent from "main/intent/custom/NMGithubIntent.js";
/* constant */
import NMConst from "main/constant/NMConstant.js";

const weeklyLimit = 10;

export default class NMHome extends NMView {
    modelList = [NMGithubModel];

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
                padding: 0px 8px;
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

    addEvent() {
        super.addEvent();
    }

    afterRender() {
        super.afterRender();
        this.getChartDatas();
    }

    onModelChange(e) {
        const { detail } = e;
        const { name, property, data } = { ...detail };

        if (name === NMGithubModel.name) {
            if (property === "commitLanguages") {
                this.setCommitLanguages(data);
            } else if (property === "commitList") {
                this.setCommitList(data);
            } else if (property === "weeklyCommitLists") {
                this.setWeeklyCommitLists(data);
            }
        }
    }

    setCommitLanguages(data) {
        const pieChart = util.DomUtil.querySelector(this, ".pie-chart");

        try {
            const pieData = {
                palette: "pantone",
                type: "pie",
                title: {
                    text: "언어별 커밋량"
                },
                dataLabel: {
                    position: "inner",
                    minHideRatio: 0.1,
                    param: {
                        style: {
                            fillStyle: "white"
                        }
                    }
                },
                data: {
                    ...data
                }
            };
            pieChart.setChart(pieData);
            pieChart.draw();
        } catch(e) {
            console.log(e);
        }
    }

    setWeeklyCommitLists(data) {
        const columnChart = util.DomUtil.querySelector(this, ".column-chart");
        try {
            const tooltipText = [];
            const chartData = [];
            
            data.forEach((d) => {
                const { name, data } = { ...d };
                const parseData = {};
                for (let idx = 0; idx < weeklyLimit; idx++) {
                    const text = `${idx}주 전`;
                    parseData[text] = data[idx];
                }

                tooltipText.push(name);
                chartData.push(parseData);
            });

            const columnData = {
                palette: "pantone",
                type: "column",
                title: { text: "주간 커밋 횟수" },
                axis: {
                    x: {
                        title: { text: "커밋 주차" },
                        tooltip: { text: tooltipText },
                    },
                    y: {
                        title: {
                            text: "횟수"
                        }
                    }
                },
                data: chartData
            };
            columnChart.setChart(columnData);
            columnChart.draw();
        } catch (e) {
            console.log(e);
        };
    }

    setCommitList(data) {
        console.log(data);
    }

    getChartDatas() {
        githubIntent.getCommitLanguages([{ owner: "nyg1230", repo: "vanillaFE" }]);
        githubIntent.getWeeklyCommitCount([
            { owner: "nyg1230", repo: "vanillaFE", ext: { name: "repo: FE-js" } },
            { owner: "nyg1230", repo: "pythonBE", ext: { name: "repo: BE-py" } },
            { owner: "nyg1230", repo: "nyg1230.github.io", ext: { name: "repo: git.io" } }
        ]);
        githubIntent.getCommitLists([{ owner: "nyg1230", repo: "vanillaFE", ext: { name: "fe" } }]);
    }
}

define(NMHome);