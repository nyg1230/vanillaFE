/* inherit */
import { NMView, define } from "main/components/core/view/NMView.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
import NMChart from "main/components/core/chart/NMChart.js";
import NMList from "main/components/core/component/NMList.js"
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
                --title-padding: 8px;
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-areas:
                    "col col col"
                    "pie com com"
                    "rec rec rec"
                    "tag tag tag";
                grid-template-columns: calc(100% / 3);
                grid-template-rows:
                    minmax(25vh, 25vh)
                    minmax(20vh, 25vh)
                    minmax(0, 10vh)
                    minmax(0, 10vh);
            }

            .title-area {
                padding-bottom: var(--title-padding);
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

            .commit-list-area {
                grid-area: com;
                --title-height: 20px;
                
                & .title-area {
                    height: var(--title-height);
                    padding-bottom: var(--title-padding);
                }

                & .list-area {
                    padding: 0px 4px;
                    overflow-y: scroll;
                    height: calc(25vh - var(--title-height) - var(--title-padding));
                }

            }

            .recent-list-area {
                grid-area: rec;
            }

            .tag-list-area {
                grid-area: tag;
            }

            .commit-list {
                --template-columns: minmax(auto, 15%) minmax(auto, 30%) auto;

                & .row {
                    .commit-name {
                        text-align: center;
                    }

                    .commit-date {
                        padding-left: 4px;
                    }

                    .commit-msg {
                        padding: 0px 4px;
                    }
                }
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
            <div class="commit-list-area">
                <div class="title-area">
                    <nm-label class="" value="commit.list" range="git" param="1,23"></nm-label>
                </div>
                <div class="list-area">
                    <nm-list class="commit-list">
                        <template>
                            <div class="row">
                                <div class="item commit-name ellipsis">
                                    <nm-label class="" data-value="name">
                                </nm-label></div>
                                <div class="item commit-date ellipsis">
                                    <nm-label class="" data-value="date" type="date" format="$Y-$M-$d $h:$m:$s" tooltip="true">
                                </nm-label></div>
                                <div class="item commit-msg ellipsis">
                                    <nm-label class="" data-value="message" tooltip="true">
                                </nm-label></div>
                            </div>
                        </template>
                    </nm-list>
                </div>
            </div>
            <div class="recent-list-area">
                <div class="title-area">
                    <nm-label class="" value="recent.list" range="board"></nm-label>
                </div>
            </div>
            <div class="tag-list-area">
                <div class="title-area">
                    <nm-label class="" value="tag.list" range="tag"></nm-label>
                </div>
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
                palette: "2023",
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
                palette: "2023",
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
        const list = util.DomUtil.querySelector(this, ".commit-list");
        const [d] = [...data];
        const { commitList } = { ...d };
        list.setData(commitList);
    }

    getChartDatas() {
        githubIntent.getCommitLanguages([{ owner: "nyg1230", repo: "vanillaFE" }]);
        githubIntent.getWeeklyCommitCount([
            { owner: "nyg1230", repo: "vanillaFE", ext: { name: "repo: FE-js" } },
            { owner: "nyg1230", repo: "pythonBE", ext: { name: "repo: BE-py" } },
            { owner: "nyg1230", repo: "nyg1230.github.io", ext: { name: "repo: git.io" } }
        ]);
        githubIntent.getCommitLists([{ owner: "nyg1230", repo: "vanillaFE", ext: { name: "fe", limit: 7 } }]);
    }
}

define(NMHome);