/* inherit */
import { NMView, define } from "js/core/components/view/NMView.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
import { NMList } from "js/core/components/component/NMList";
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

            .header-area {
                display: grid;
                grid-template-columns: "a b c d e f";
            }

            .account-list {
                display: block;
                width: 100%;

                & .row {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 2px;

                    & .history::part(nm-input) {
                        --width: 150px;
                    }

                    & .price::part(nm-input) {
                        --width: 100px;
                    }

                    & .memo::part(nm-input) {
                        --width: 200px;
                    }

                    & .date::part(nm-input) {
                        --width: 100%;
                    }

                    & .close {
                        cursor: pointer;
                        
                        &::part(nm-icon) {
                            --stroke: red;
                        }
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
                <div class="header-area">
                    <nm-label calss="medium sub-title" value="history" range="account"></nm-label>
                    <nm-label calss="medium sub-title" value="division" range="account"></nm-label>
                    <nm-label calss="medium sub-title" value="price" range="account"></nm-label>
                    <nm-label calss="medium sub-title" value="memo" range="account"></nm-label>
                    <nm-label calss="medium sub-title" value="date" range="account"></nm-label>
                    <nm-label calss="medium sub-title" value="remove" range="account"></nm-label>
                </div>
                <nm-list class="account-list">
                    <template>
                        <div class="row">
                            <nm-input class="history" nm-prop="history"></nm-input>
                            <nm-radio class="division" nm-prop="division"></nm-radio>
                            <nm-input type="number" class="price" nm-prop="price"></nm-input>
                            <nm-input class="memo" nm-prop="memo"></nm-input>
                            <nm-input type="date" class="date" nm-prop="date"></nm-input>
                            <nm-icon class="close" icon="close" size=""></nm-icon>
                        <div>
                    </template>
                </nm-list>
            </div>
            <div class="add-button-area">
                <nm-button class="add-list" value="add"></nm-button>
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
        return [
            { test: 1, qwer: 2 }
        ];
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

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "add-list", "class"),
                callback: (btn) => {
                    this.#accountList.$add = this.#defaultData;
                }
            },
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "regist", "class"),
                callback: () => {
                    accountIntent.addList();
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
        
        const radio = util.DomUtil.querySelector(target, ".division", false);
        radio && (radio.$data = [
            { title: "income", range: "account", value: "i" },
            { title: "expenditure", range: "account", value: "o" }
        ]);

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
}

define(NMAddAccount);
