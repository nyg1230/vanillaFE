/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMInput extends NMComponent {
    #input;

    static get staticAttrs() {
        return ["nm-prop"];
    }

    static get defineProperty() {
        return { value: "", type: "text" };
    }

    static get name() {
        return "nm-input";
    }

    get clsName() {
        return NMInput.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                --width: 50px;
                width: fit-content;

                & input {
                    width: var(--width);
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <input type="${this.type}" part="input"/>
        </div>`;
    }

    get input() {
        !this.#input && (this.#input = util.DomUtil.querySelector(this, "input"));
        return this.#input;
    }

    addEvent() {}

    afterRender() {
        this.input && (this.#input.value = this.value);
        this.bindEvent(this.input, NMConst.eventName.INPUT, this.onInput);
    }

    onInput(e) {
        const { target } = e;
        this.value = target.value;
    }

    onChangeAttr(name, old, value) {
        if (old !== value) {
            if (name === "value") {
                this.input && (this.input.value = value);
                let type;

                if (util.CommonUtil.isNull(old)) {
                    type = NMConst.actionName.INSERT;
                } else if (util.CommonUtil.isNull(value)) {
                    type = NMConst.actionName.DELETE;
                } else {
                    type = NMConst.actionName.UPDATE;
                }

                const p = { property: this["nm-prop"], old, value, type, target: this };
                util.EventUtil.dispatchEvent(this, NMConst.eventName.VALUE_CHANGE, p);
            }
        }
    }

    focus() {
        window.setTimeout(() => {
            this.input && this.input.focus()
        });
    }

    destroy() {
        this.#input = null;
        super.destroy();
    }
}

define(NMInput);

export { NMInput, define };
