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

            }

            .button-area {
                display: flex;
                justify-content: center;
                gap: 4px;
            }

            .bottom-area {
                display: flex;
                justify-content: center;
            }

            .row {
                display: flex;
                flex-direction: column;
                border: 1px solid black;
                padding: 12px 20px;

                & .header {
                    width: 100%;
                    display: flex;
                    justify-content: end;

                    & .close {
                        cursor: pointer;
                    }
                }

                & .content {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    & nm-input::part(nm-input) {
                        display: inline;
                        --width: 100%;
                    }

                    & .input-area {
                        display: flex;
                        flex-direction: column;
                    }
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
            <div class="list-area">
                <nm-list class="account-list">
                    <template>
                        <div class="row">
                            <div class="header">
                                <nm-icon class="close" icon="close" size=""></nm-icon>
                            </div>
                            <div class="content">
                                <div class="input-area">
                                    <nm-label class="subtitle medium" value="history" range="account"></nm-label>
                                    <nm-input class="history" nm-prop="history"></nm-input>
                                </div>
                                <div class="input-area">
                                    <nm-label class="subtitle medium" value="type" range="account"></nm-label>
                                    <nm-radio class="type" nm-prop="type"></nm-radio>
                                </div>
                                <div class="input-area">
                                    <nm-label class="subtitle medium" value="amount" range="account"></nm-label>
                                    <nm-input type="number" class="amount" nm-prop="amount"></nm-input>
                                </div>
                                <div class="input-area">
                                    <nm-label class="subtitle medium" value="memo" range="account"></nm-label>
                                    <nm-input class="memo" nm-prop="memo"></nm-input>
                                </div>
                                <div class="input-area">
                                    <nm-label class="subtitle medium" value="target.date" range="account"></nm-label>
                                    <nm-input type="date" class="target-date" nm-prop="target_date"></nm-input>
                                </div>
                                <div class="input-area">
                                    <nm-label class="subtitle medium" value="tag"></nm-label>
                                    <nm-tag-box class="tags" nm-prop="tags" editable="true"></nm-tag-box>
                                </div>
                            </div>
                        <div>
                    </template>
                </nm-list>
            </div>
            <div class="button-area">
                <nm-button class="add-list" value="add.row"></nm-button>
                <nm-button class="clear-list" value="clear"></nm-button>
            </div>
            <div class="bottom-area">
                <nm-button class="regist" value="registration"></nm-button>
            </div>
        </div>`;
    }

    get #accountList() {
        return util.DomUtil.querySelector(this, ".account-list");
    }

    get #defaultData() {
        return [ {} ];
    }

    addEvent() {
        this.bindEvent(this, "add-row", this.onAddRow);
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
                condition: () => util.EventUtil.getDomFromEvent(e, "add-list", "class"),
                callback: () => {
                    this.#accountList.$add = this.#defaultData;
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
                    this.vaildCheck() && accountIntent.addList();
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "close", "class"),
                callback: (icon) => {
                    const row = icon.closest("nm-row");
                    util.EventUtil.dispatchEvent(row, NMConst.eventName.REMOVE);
                }
            }
        ]);
    }

    onAddRow(e) {
        const { detail } = e;
        const { target } = detail;
        
        const radio = util.DomUtil.querySelector(target, "nm-radio.type", false);
        radio && (radio.$data = [
            { title: "income", range: "account", value: "i" },
            { title: "expenditure", range: "account", value: "o" }
        ]);

        const tagBox = util.DomUtil.querySelector(target, "nm-tag-box.tags", false);
        if (tagBox) {
            tagBox.$data = [];
            target.$data.tags = tagBox.$data;
        }

        const input = util.DomUtil.querySelector(target, "nm-input", false);
        input && input.focus();
    }

    onValueChange(e) {
        const { detail } = e;
        const { property, value } = detail;

        util.EventUtil.eventFilters([
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
}

define(NMAddAccount);
