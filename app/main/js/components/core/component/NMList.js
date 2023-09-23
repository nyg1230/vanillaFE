/* inherit */
import { NMComponent, define } from "main/components/core/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant.js";

export default class NMList extends NMComponent {
    #header = {};
    #items = {};
    #template;
    #fragment;

    static get name() {
        return "nm-list";
    }

    get clsName() {
        window.qqq = this;
        
        return NMList.name;
    }

    get styles() {
        return `
        .${this.clsName} {}
        `;
    }

    get template() {
        window.qqq = this;
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
        this.renderHeader();
        this.renderList(this.#items);
    }

    renderList(items) {
        const fragment = this.#fragment;
        const entries = Object.entries(items).sort((a, b) => a[0] > b[0]);

        entries.forEach(([idx, v]) => {
            const { data } = { ...v };
            const row = this.renderRow(idx, data);
            fragment.appendChild(row);

            const node = util.DomUtil.querySelector(fragment, `[index="${idx}"]`);
            const tmp = fragment.lastElementChild;
            v.node = node;
        });

        this.appendChild(fragment);
    }

    renderHeader() {
        const { item } = { ...this.#header };
        
        if (util.CommonUtil.isNotEmpty(item)) {
            const node = document.importNode(this.#template.content, true);
            util.DomUtil.addClass(node.firstElementChild, "header");

            Object.entries(item).forEach(([k, data]) => {
                const target = util.DomUtil.querySelector(node, `[data-value="${k}"]`);
                Object.entries(data).forEach(([dk, dv]) => {
                    target[dk] = dv;
                });
            });
            this.#fragment.appendChild(node);
            this.#header.node = this.#fragment.lastElementChild;
        }
    }

    renderRow(index, data) {
        const node = document.importNode(this.#template.content, true);
        const firstEl = node.firstElementChild

        firstEl && firstEl.setAttribute("index", index);
        Object.entries(data).forEach(([k, v]) => {
            const nodeList = util.DomUtil.querySelectorAll(node, `[data-value="${k}"]`);
            nodeList.forEach((n) => (n.value = v));
        });
        return node;
    }

    clear() {
        Object.entries(this.#items).forEach(([k, item]) => {
            const { node } = { ...item };

            try {
                node.remove()
            } finally {
                if (item) {
                    item.node = null;
                    delete this.#items[k];
                }
            }
        });

        this.#header = {};
    }
}

define(NMList);
