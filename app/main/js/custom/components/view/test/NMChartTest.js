/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMGithubModel from "js/custom/model/NMGithubModel.js";
/* intent */
import githubIntent from "js/custom/intent/NMGithubIntent.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMChartTest extends NMView {
    modelList = [NMGithubModel];

    static get name() {
        return "nm-chart-test";
    }

    get clsName() {
        return NMChartTest.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                width: 100%;
                height: 100%;
                padding: 8px;
                display: flex;

                & .chart-area {
                    width: 800px;
                    height: 600px;
                    border: 1px solid black;
                }
            }
        `;
    }

    get template() {
        return `<div class="${this.clsName}" part="${this.clsName}">
                    <div class="chart-area">
                        <nm-chart class="column"></nm-chart>
                    </div>

                    <div class="chart-area">
                        <nm-chart class="pie"></nm-chart>
                    </div>
                </div>`;
    }

    afterRender() {
        super.afterRender();
        this.getChartData();
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

    getChartData() {
        githubIntent.getCommitLanguages([{ owner: "nyg1230", repo: "vanillaFE" }]);
        githubIntent.getWeeklyCommitCount([
            { owner: "nyg1230", repo: "vanillaFE", ext: { name: "repo: FE-js" } },
            { owner: "nyg1230", repo: "pythonBE", ext: { name: "repo: BE-py" } },
            { owner: "nyg1230", repo: "nyg1230.github.io", ext: { name: "repo: git.io" } }
        ]);
    }

    setCommitLanguages(data) {
        const chart = util.DomUtil.querySelector(this, ".pie");
        const chartData = {
            palette: "pantone",
            header: {
                title: "Pie Chart",
                style: {
                    font: "bold 40px auto"
                }
            },
            data: []
        };

        const parse = Object.entries(data).map(([k, v]) => {
            return { title: k, value: v };
        });

        chartData.data.push({
            type: "pie",
            list: parse
        })

        chart.data = chartData;
    }

    setWeeklyCommitLists(data) {
        const chart = util.DomUtil.querySelector(this, ".column");

        const chartData = {
            header: {
                title: "Chart Name"
            },
            axis: {
                x: {
                    title: "Commit Week"
                },
                ly: {
                    title: "Commit Count",
                    label: {
                        prefix: "",
                        suffix: ""
                    }
                },
                ry: {}
            },
            data: []
        };

        data.forEach((d, idx) => {
            const { data, name } = { ...d };
            let newData = data.splice(0, 12);
            newData = newData.map((nd, idx) => {
                return {
                    value: nd,
                    title: `${idx}주 전`
                }
            });
            chartData.data[idx] = {
                type: "column",
                title: name,
                list: newData
            }
        });
        // chart.data = chartData;
    }
}

define(NMChartTest);