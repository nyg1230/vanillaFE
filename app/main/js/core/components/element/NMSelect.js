/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMSelect extends NMComponent {
    #elem;

    static get staticAttrs() {
        return ["nm-prop"];
    }

    static get defineProperty() {
        return { value: "" };
    }

    static get name() {
        return "nm-select";
    }

    get clsName() {
        return NMSelect.name;
    }

    get styles() {
        return `
            .${this.clsName} {
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <select></select>
        </div>`;
    }

    get elem() {
        !this.#elem && (this.#elem = util.DomUtil.querySelector(this, "select"));
        return this.#elem;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, "option"),
                callback: (option) => {
                    this.value = option.value;
                }
            }
        ]);
    }

    onChangeAttr(name, old, value) {
        if (name === "value") {
            const p = { property: this["nm-prop"], value, target: this };
            util.EventUtil.dispatchEvent(this, NMConst.eventName.VALUE_CHANGE, p);
        }
    }

    setData(data = []) {
        let html = "";

        data.forEach((d) => {
            const { title, range, value } = { ...d };
            const option = `<option value="${value}">${util.TranslateUtil.translate(title, range)}</nm-label></option>`;
            html += option;
        });

        this.elem.innerHTML = html;
        const { value } = { ...data[0] };
        this.value = value;
    }

    destroy() {
        this.#elem = null;
        super.destroy();
    }
}

define(NMSelect);

export { NMSelect, define };
