/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import { NMList } from "js/core/components/component/NMList.js";
import { NMTagBox } from "js/core/components/component/NMTagBox.js";
import { NMChart } from "js/core/components/chart/NMChart";
import { NMCarousel } from "js/core/components/component/NMCarousel.js";
/* model */
import NMAccountModel from "js/custom/model/account/NMAccountModel.js";
/* intent */
import chartIntent from "js/custom/intent/chart/NMChartIntent.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
import accountIntent from "js/custom/intent/account/NMAccountIntent";

export default class NMAccountList extends NMView {
    modelList = [NMAccountModel];
    #page = {
        page: 0,
        order: [{ target_date: "desc" }]
    }

    static get name() {
        return "nm-account-list";
    }

    get clsName() {
        return NMAccountList.name;
    }

    get styles() {
        return `
            .${this.clsName} {}

            .list-area {
                padding: 8px 20px;

                & nm-input::part(nm-input) {
                    display: inline;
                    --width: 100%;
                }

                & .card {
                    border-radius: 4px;
                    width: 250px;
                    background-color: var(--pristine);
                    padding: 4px 8px;
                }

                & .check-area {
                    display: flex;
                    gap: 8px;
                }

                & .button-area {
                    padding: 4px 8px;
                    display: flex;
                    gap: 4px;
                    justify-content: end;
                }
            }

            .input-area {
                display: flex;
                flex-direction: column;
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <div></div>
            <div class="list-area">
                <nm-list class="account-list">
                    <template>
                        <div class="row">
                            <div class="date-area">
                                <nm-label class="title large" nm-date="value" format=""></nm-label>
                            </div>
                            <div class="content">
                                <nm-carousel nm-list="$data">
                                    <template>
                                        <div class="card">
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="history" range="account"></nm-label>
                                                <nm-input class="history" nm-history="value" nm-prop="history"></nm-input>
                                            </div>
                                            <div class="flex check-area">
                                                <div class="input-area">
                                                    <nm-label class="subtitle medium" value="category"></nm-label>
                                                    <nm-select class="category" nm-category="value" nm-prop="category"></nm-select>
                                                </div>
                                                <div class="input-area">
                                                    <nm-label class="subtitle medium" value="type" range="account"></nm-label>
                                                    <nm-radio class="type" nm-prop="type"></nm-radio>
                                                </div>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="amount" range="account"></nm-label>
                                                <nm-input type="number" class="amount" nm-amount="value" nm-prop="amount"></nm-input>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="memo" range="account"></nm-label>
                                                <nm-input class="memo" nm-memo="value" nm-prop="memo"></nm-input>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="target.date" range="account"></nm-label>
                                                <nm-input type="date" class="target-date" nm-target_date="value" nm-prop="target_date"></nm-input>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="tag"></nm-label>
                                                <nm-tag-box class="tags" nm-prop="tags" nm-tags="$data" editable="true"></nm-tag-box>
                                            </div>
                                            <div class="button-area">
                                                <nm-button class="modify" value="modify"></nm-button>
                                                <nm-button class="delete" value="delete"></nm-button>
                                            </div>
                                        </div>
                                    </template>
                                </nm-carousel>
                            </div>
                        </div>
                    </template>
                </nm-list>
            </div>
        </div>`;
    }
    
    get #getAccountList() {
        return util.DomUtil.querySelector(this, ".account-list");
    } 

    afterRender() {
        super.afterRender();
        this.#getAccountList.$data = { list: this.getAccountList() };
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.ADD_CHILD_COMP, this.onAddChildComp);
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    onAddChildComp(e) {
        const { detail } = e;
        const { target } = detail;
        
        const radio = util.DomUtil.querySelector(target, "nm-radio.type", false);
        radio && (radio.$data = [
            { title: "income", range: "account", value: "i" },
            { title: "expenditure", range: "account", value: "o" }
        ]);

        const select = util.DomUtil.querySelector(target, "nm-select.category", false);
        if (select) {
            select.$data = [
                { title: "income", range: "account", value: "income" },
                { title: "housing.cost", range: "account", value: "house" },
                { title: "communication.cost", range: "account", value: "communication" },
                { title: "food.cost", range: "account", value: "food" }
            ];
        }
    }

    onChangeModel(e) {
        console.log(e);
    }

    getAccountList() {
        return [
            {
                date: "2024-01-02",
                list: [
                    {
                        history: "월급",
                        type: "i",
                        memo: "키키",
                        amount: 3000000,
                        category: "income",
                        target_date: "2024-01-02",
                        tags: []
                    },
                    {
                        history: "점심",
                        type: "o",
                        memo: "순대국",
                        amount: 10000,
                        category: "food",
                        target_date: "2024-01-02",
                        tags: [{ tag: "test" }, { tag: "123" }]
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ]
            },
            {
                date: "2023-12-25",
                list: [
                    {
                        history: "테스트",
                        type: "o",
                        memo: "키키",
                        amount: 25000,
                        category: "수입",
                        target_date: "2024-12-25",
                        tags: []
                    },
                    {
                        history: "점심",
                        type: "o",
                        memo: "쌀국수",
                        amount: 10000,
                        category: "food",
                        target_date: "2024-12-25",
                        tags: [{ tag: "test" }, { tag: "123" }]
                    }
                ]
            }
        ]
    }
}

define(NMAccountList)
