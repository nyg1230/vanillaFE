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
import accountIntent from "js/custom/intent/account/NMAccountIntent";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";
import { collection } from "js/config/data/collection";

export default class NMAccountList extends NMView {
    modelList = [NMAccountModel];
    #page;

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
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
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
                                                <nm-label class="subtitle medium" value="target.date" range="account"></nm-label>
                                                <nm-input type="date" class="target-date" nm-target_date="$value" nm-prop="target_date"></nm-input>
                                            </div>
                                            <div class="input-area">
                                                <nm-label class="subtitle medium" value="tag"></nm-label>
                                                <nm-tag-box class="tags" nm-prop="tags" nm-tags="$data" editable="true"></nm-tag-box>
                                            </div>
                                            <!--
                                            <div class="button-area">
                                                <nm-button class="modify" value="modify" icon="edit" size="14"></nm-button>
                                                <nm-button class="delete" value="delete" icon="trash" size="14"></nm-button>
                                            </div>
                                            -->
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

    initPage() {
        this.#page = {
            page: 0,
            count: 100,
            order: [{ target_date: "desc" }]
        };
    }
    
    get #getAccountList() {
        return util.DomUtil.querySelector(this, ".account-list");
    } 

    afterRender() {
        super.afterRender();
        this.initPage();
        this.getAccountList();
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.ADD_CHILD_COMP, this.onAddChildComp);
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
        this.bindEvent(this, NMConst.eventName.ADD_TAG, this.onAddTag);
        this.bindEvent(this, NMConst.eventName.REMOVE_TAG, this.onRemoveTag);
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "nm-button"),
                callback: (btn) => {
                    console.log(btn);

                    const comp = util.EventUtil.getDomFromEvent(e, "nm-horse", undefined, 15);
                    if (comp) {
                        const { oid } = { ...comp.$data };
                        accountIntent.update(oid);
                    }
                }
            }
        ]);
    }

    onAddTag(e) {
        const { detail } = e;
        const { target } = detail;

        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "nm-horse"),
                callback: (comp) => {
                    const { oid } = comp.$data;
                    const { tag } = target.$data;

                    if (oid && tag) {
                        const p = { target_oid: oid, tag };
                        accountIntent.addTag(p);
                    }
                }
            }
        ]);

        console.log(target);
        console.log(target.$data);
    }

    onRemoveTag(e) {
        console.log(e);
        const { detail } = e;
        const { target } = detail;

        const { oid } = { ...target.$data };
        
        oid && accountIntent.removeTag(oid);
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
            select.$data = collection.category;
        }
    }

    onModelChange(e) {
        const { detail } = e;
        const { data: _data, name, property } = detail;
        const { data, page } = { ..._data.data };
        
        if (name === NMAccountModel.name) {
            if (property === "list") {
                const parsed = this.parseData(data);
                this.#getAccountList.$data = { list: parsed };
            }
        }
    }

    onValueChange(e) {
        const { detail } = e;
        const { property, value } = detail;

        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "nm-horse"),
                callback: (comp) => {
                    const { oid } = comp.$data;

                    if (property) {
                        // console.log(property);
                        // accountIntent.update(oid, { [property]: value } );
                        util.CommonUtil.debounce(accountIntent, "update", [oid, { [property]: value }]);
                    }
                }
            }
        ]);
    }

    getAccountList() {
        accountIntent.getList({ with_tag: true, sort: { target_date: "desc" } }, this.#page);
    }

    parseData(data) {
        const parsed = {};

        data.forEach((d) => {
            const { target_date: targetDate } = d;
            const date = new Date(targetDate);
            const dateStr = util.DateUtil.dateToFormatString(date, "$Y-$M-$d");
            d.target_date = dateStr;
            // const parsedIdx = parsed.findIndex(p.date > targetDate);

            // !parsed[targetDate] && (parsed[targetDate] = []);
            // parsed[targetDate].push(d);

            if (!parsed[dateStr]) {
                parsed[dateStr] = [d];
            } else {
                parsed[dateStr].push(d);
            }
        });

        const result = Object.keys(parsed).sort().map((k) => {
            return {
                date: k,
                list: parsed[k]
            }
        });

        return result;
    }
}

define(NMAccountList)
