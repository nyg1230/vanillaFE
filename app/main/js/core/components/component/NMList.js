/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMList extends NMComponent {
    #header = {};
    #items = {};
    #template;
    #fragment;

    static get name() {
        return "nm-list";
    }

    get clsName() {
        return NMList.name;
    }

    get styles() {
        return `
        .${this.clsName} {}
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <div class="header-area"></div>
            <div class="content-area">
                <slot></slot>
            </div>
        </div>`;
    }

    get data() {
        return this.#items;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    onClick(e) {
        const row = util.EventUtil.getDomFromEvent(e, NMRow.name);

        if (row) {
            const data = row.$data;
            util.EventUtil.dispatchEvent(this, NMConst.eventName.LIST_ROW_CLICK, { ...data });
        }

        e.preventDefault();
        e.stopPropagation();
    }

    afterRender() {
        const template = this.querySelector("template");
        this.#template = template;
    }

    setData(data) {
        this.clear();
        let tmpList;

        if (!util.CommonUtil.isArray(data)) {
            const { header, list } = { ...data };
            this.#header = { item: header };
            tmpList = list;
        } else {
            tmpList = data;
        }

        tmpList.forEach((d, idx) => {
            this.#items[idx] = { data: d };
        });

        this.#fragment = document.createDocumentFragment();
        this.renderList(this.#items);
    }

    renderList(items) {
        const fragment = this.#fragment;
        const entries = Object.entries(items).sort((a, b) => a[0] > b[0]);

        entries.forEach(([idx, v]) => {
            try {
                const { data } = v;
                const row = this.renderRow(idx, data);
                fragment.appendChild(row);
            } catch (e) {
                console.log(`${this.clsName} renderList error >>>`, e);
            }
        });

        this.appendChild(fragment);
    }

    renderRow(index, data) {
        const cloneNode = document.importNode(this.#template.content, true);
        const node = cloneNode.firstElementChild;

        if (node) {
            node.setAttribute("index", index);
            node.$data = data;
        }

        return node;
    }

    clear() {
        while (this.firstChild) {
            this.firstChild.remove();
        }

        this.#header = {};
    }
}

class NMRow extends NMComponent {
    static get name() {
        return "nm-row";
    }

    get clsName() {
        return NMRow.name;
    }

    get styles() {
        return ``;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <slot></slot>
        </div>`;
    }

    setData(data) {
        Object.entries(data).forEach(([k, v]) => {
            const nodes = util.DomUtil.querySelectorAll(this, `[data-${k}]`, false);
            nodes.forEach((node) => {
                const attr = node.getAttribute(`data-${k}`);
                node[attr] = v;
            });
        });
    }
}

define(NMList);
define(NMRow);

export { NMList, NMRow }
