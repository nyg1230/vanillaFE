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
                            <div class="content">
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
                            </div>
                            <div class="button-area">
                                <nm-button class="modify" value="modify"></nm-button>
                                <nm-button class="delete" value="delete"></nm-button>
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

    onChangeModel(e) {
        console.log(e);
    }

    getAccountList() {
        return [
            {
                history: "월급",
                type: "i",
                memo: "키키",
                amount: 3000000,
                category: "수입",
                target_date: "2024-01-02",
                tags: []
            },
            {
                history: "점심",
                type: "o",
                memo: "순대국",
                amount: 10000,
                category: "food",
                tags: [{ tag: "test" }, { tag: "123" }]
            }
        ]
    }
}

define(NMAccountList)
