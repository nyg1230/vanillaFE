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
        return { value: "", name: "", icon: "", size: "" };
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

                & .button {
                    display: flex;
                    align-items: center;
                }

                & .icon {
                }
            }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <button class="button" part="button">
                <nm-icon class="icon" part="icon"></nm-icon>
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

    setIcon() {
        const iconElem = util.DomUtil.querySelector(this, "nm-icon");
        if (iconElem) {
            iconElem.icon = this.icon;
            iconElem.size = this.size;
        }
    }

    onChangeAttr(name, old, value) {
        if (name === "value") {
            this.setLabel(name, value);
        } else if (name === "icon") {
            this.setIcon(value);
        }
    }
}

define(NMButton);

export { NMButton, define };
