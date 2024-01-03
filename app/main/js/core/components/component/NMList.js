/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMList extends NMComponent {
    #template;

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
            <slot></slot>
        </div>`;
    }
    afterRender() {
        const template = util.DomUtil.querySelector(this, "template", false);
        this.#template = template.cloneNode();
        template.remove();
    }

    setData(data) {
        this.clear();
        const { list = [] } = data;

        cosnt frag = document.createDocumentFragment();

        list.forEach((d) => {
            const row = new NMRow();
            const node = document.importNode(this.#template, true);
            row.appendChild(node);
            row.$data = d;

            frag.appendChild(row);
        });

        this.appendChild(frag);
    }

    clear() {
        util.DomUtil.removeAllChild(this);
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
            const nodes = util.DomUtil.quertSelectorAll(this, `[nm-${k}]`, false);
            nodes.forEach((node) => {
                const attr = node.getAttribute(`nm-${k}`);
                node[attr] = v;
            });
        });
    }
}

define(NMList);
define(NMRow);

export { NMList, NMRow }
