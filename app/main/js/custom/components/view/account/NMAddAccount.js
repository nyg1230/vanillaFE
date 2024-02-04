/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import { NMList } from "js/core/components/component/NMList.js";
import { NMTagBox } from "js/core/components/component/NMTagBox.js";
import { NMChart } from "js/core/components/chart/NMChart";
/* model */
import NMAccountModel from "js/custom/model/account/NMAccountModel.js";
/* intent */
import chartIntent from "js/custom/intent/chart/NMChartIntent.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
import accountIntent from "js/custom/intent/account/NMAccountIntent";
import { collection } from "js/config/data/collection";

const weeklyLimit = 10;

export default class NMAddAccount extends NMView {
    modelList = [NMAccountModel];

    static get name() {
        return "nm-account-add";
    }

    get clsName() {
        return NMAddAccount.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                height: 100%;
            }

            .title-area {
                padding: 8px 16px;
                display: flex;
                justify-content: center;
            }

            .header-area {
                display: flex;
                background-color: var(--honey-peach);
            }

            .list-area {
                padding: 8px 20px;
            }

            .account-list {
                display: block;
                width: 100%;

                &::part(nm-list) {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
            }

            .button-area {
                display: flex;
                justify-content: center;
                gap: 4px;
            }

            .bottom-area {
                display: flex;
                justify-content: center;
                gap: 4px;
            }

            .row {
                display: flex;
                flex-direction: column;
                // background-color: var(--pantone-bright-white);
                gap: 4px;
                padding: 4px 20px;

                & nm-input::part(nm-input) {
                    display: inline;
                    --width: 100%;
                }

                & .haeder {
                    display: flex;

                    & .button-area {
                        align-items: center;
                        display: flex;
                    }
                }

                & .card {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    border-radius: 4px;
                    width: 250px;
                    background-color: var(--pristine);
                    padding: 4px 8px;

                    & .icon-area {
                        display: flex;
                        justify-content: flex-end;

                        & nm-icon {
                            cursor: pointer;
                        }
                    }
                }
            }

            .bottom-area {
                display: flex;
                flex-direction: column;

                & > div {
                    display: flex;
                    gap: 4px;
                    justify-content: center;
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <div class="title-area">
                <nm-label class="" value="add.account" range="account"></nm-label>
            </div>
            <div clas="list-area">
                <nm-list class="account-list">
                    <template>
                        <div class="row">
                            <div class="haeder">
                                <div class="date-area">
                                    <nm-input type="date" nm-target_date="value" nm-prop="target_date"></nm-input>
                                </div>
                                <div class="button-area">
                                    <nm-button value="add.item" class="add-card"></nm-button>
                                    <nm-button value="remove.row" class="remove-row"></nm-button>
                                </div>
                            </div>
                            <div class="content">
                                <nm-carousel>
                                    <template>
                                        <div class="card">
                                            <div class="icon-area">
                                                <nm-icon icon="close" size="14" class="remove-card"></nm-icon>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="history" range="account"></nm-label>
                                                <nm-input class="history" nm-history="$value" nm-prop="history"></nm-input>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="category"></nm-label>
                                                <nm-select class="category" nm-category="$value" nm-prop="category"></nm-select>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="amount" range="account"></nm-label>
                                                <nm-input type="number" class="amount" nm-amount="$value" nm-prop="amount"></nm-input>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="memo" range="account"></nm-label>
                                                <nm-input class="memo" nm-memo="$value" nm-prop="memo"></nm-input>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="tag"></nm-label>
                                                <nm-tag-box class="tags" nm-prop="tags" nm-tags="$data" editable="true"></nm-tag-box>
                                            </div>
                                        </div>
                                    </template>
                                </nm-carousel>
                            </div>
                        </div>
                    </template>
                </nm-list>
            </div>
            <div class="bottom-area">
                <div class="">
                    <nm-button value="add" class="add-row"></nm-button>
                    <nm-button value="clear" class="clear-list"></nm-button>
                </div>
                <div class="">
                    <nm-button value="regist.account" range="account" class="regist"></nm-button>
                </div>
            </div>
        </div>`;
    }

    get #accountList() {
        return util.DomUtil.querySelector(this, ".account-list");
    }

    get #defaultData() {
        return [
            {
                target_date: "2024-01-24",
                list: [{}]
            }
        ];
    }

    addEvent() {
        this.bindEvent(this, "add-row", this.onAddRow);
        this.bindEvent(this, NMConst.eventName.ADD_CHILD_COMP, this.onAddChildComp);
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    afterRender() {
        super.afterRender();
        const accountList = this.#defaultData;
        this.#accountList.$data = { list: accountList };
        accountIntent.set(["list"], accountList);
    }

    onModelChange(e) {
        const { detail } = e;
        const { name, property, data } = detail;

        if (name === NMAccountModel.name) {
            if (property === "list") {
                window.qqq = data;
            }
        }
    }

    onStateChange(e) {
        const { detail } = e;
        const { name, property, state } = detail;

        if (name === NMAccountModel.name) {
            if (property === "addList") {
                if (state) {
                    this.clearList();
                }
            }
        }
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "add-row", "class"),
                callback: () => {
                    this.#accountList.$add = this.#defaultData;
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "remove-row", "class"),
                callback: (btn) => {
                    const row = btn.closest("nm-row");
                    util.EventUtil.dispatchEvent(row, NMConst.eventName.REMOVE);
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "clear-list", "class"),
                callback: () => {
                    this.clearList();
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "regist", "class"),
                callback: () => {
                    this.registList();
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "remove-card", "class"),
                callback: (icon) => {
                    const horse = icon.closest("nm-horse");
                    util.EventUtil.dispatchEvent(horse, NMConst.eventName.REMOVE);
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "add-card", "class", 15),
                callback: (btn) => {
                    const row = btn.closest("nm-row");

                    if (row) {
                        const carousel = util.DomUtil.querySelector(row, "nm-carousel", false);
                        carousel && (carousel.$add = {})
                    }
                }
            }
        ]);
    }

    onAddRow(e) {
        const { detail } = e;
        const { target } = detail;

        const carousel = util.DomUtil.querySelector(target, "nm-carousel", false);
        if (carousel) {
            const { list } = target.$data;
            carousel.$data = list;
        }

        const tagBox = util.DomUtil.querySelector(target, "nm-tag-box.tags", false);
        if (tagBox) {
            tagBox.$data = [];
            target.$data.tags = tagBox.$data;
        }
        
        const select = util.DomUtil.querySelector(target, "nm-select.category", false);
        if (select) {
            select.$data = [
                { title: "income", range: "account", value: "income" },
                { title: "housing.cost", range: "account", value: "house" },
                { title: "communication.cost", range: "account", value: "communication" },
                { title: "food.cost", range: "account", value: "food" }
            ];
        }

        const input = util.DomUtil.querySelector(target, "nm-input", false);
        input && input.focus();

    }

    onAddChildComp(e) {
        const { detail } = e;
        const { target } = detail;

        const select = util.DomUtil.querySelector(target, "nm-select.category", false);
        if (select) {
            select.$data = collection.category;
        }

        const tagBox = util.DomUtil.querySelector(target, "nm-tag-box.tags", false);
        if (tagBox) {
            tagBox.$data = [];
            const row = tagBox.closest("nm-row");
            row && (row.$data.tags = tagBox.$data);
        }
    }

    onValueChange(e) {
        const { detail } = e;
        const { property, value } = detail;

        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "nm-horse", undefined, 20),
                callback: (horse) => {
                    horse.$data[property] = value;
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "nm-row", undefined, 20),
                callback: (row) => {
                    row.$data[property] = value;
                }
            }
        ]);
    }

    clearList() {
        this.#accountList.clear();
        this.#accountList.$add = this.#defaultData;
    }

    vaildCheck() {
        return true;
    }

    registList() {
        if (!this.vaildCheck()) {
            console.log("invalid");
            return;
        }

        const list = NMAccountModel.get("list");
        
        const newList = [];

        list.forEach((d) => {
            const { target_date, list: accountList } = d;

            accountList.forEach((l) => {
                l.target_date = target_date;
                newList.push(l);
            });
        });

        accountIntent.addList(newList);
    }
}

define(NMAddAccount);
