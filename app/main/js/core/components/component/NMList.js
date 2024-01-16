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

    set $add(data) {
        this.#addData(data);
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.REMOVE, this.onRemove);
    }

    afterRender() {
        const template = util.DomUtil.querySelector(this, "template", false);
        this.#template = template;
        template.remove();
    }

    onRemove(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, NMRow.name),
                callback: (row) => {
                    const { list } = this.$data
                    const idx = list.findIndex((d) => d === row.$data);

                    if (idx > -1) {
                        list.splice(idx, 1);
                        row.remove();
                    }
                }
            }
        ]);
    }

    setData(data) {
        this.clear(false);
        const { list = [] } = data;

        const frag = document.createDocumentFragment();

        list.forEach((d) => {
            const row = this.#getRow(d);
            frag.appendChild(row);
        });

        this.appendChild(frag);
    }

    #addData(data) {
        const { list = [] } = this.$data;

        if (!util.CommonUtil.isArray(data)) {
            data = [data];
        }

        data.forEach((d) => {
            const row = this.#getRow(d);
            list.push(d);
            this.appendChild(row);
        });
    }

    #getRow(data) {
        const row = new NMRow();
        const node = document.importNode(this.#template.content, true);
        row.appendChild(node);
        row.$data = data;

        return row;
    }

    clear(init = true) {
        util.DomUtil.removeAllChild(this);
        if (init) {
            const { list } = this.$data;
            list.splice(0);
        }
    }

    destroy() {
        this.#template = null;
        super.destroy();
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

    afterRender() {
        util.EventUtil.dispatchEvent(this, "add-row", { target: this });
    }

    setData(data) {
        this.setPropertyData(data, false);
    }
}

define(NMList);
define(NMRow);

export { NMList }
