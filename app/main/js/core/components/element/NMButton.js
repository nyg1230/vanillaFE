/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMButton extends NMComponent {
    #input;

    static get defineProperty() {
        return { value: "" };
    }

    static get name() {
        return "nm-button";
    }

    get clsName() {
        return NMButton.name;
    }

    get styles() {
        return `
            .${this.clsName} {
                display: block;
                width: 100%;

                & button {}
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <button class="">
                <nm-label></nm-label>
            </button>
        </div>`;
    }

    get input() {
        !this.#input && (this.#input = util.DomUtil.querySelector(this, "input"));
        return this.#input;
    }

    setLabel(prop, value) {
        const label = util.DomUtil.querySelector(this, "nm-label");
        label[prop] = value;

    }

    onChangeAttr(name, old, value) {
        if (name === "value") {
            this.setLabel(name, value);
        }
    }
}

define(NMButton);

export { NMButton, define };
