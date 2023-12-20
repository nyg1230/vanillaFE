/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMRadio extends NMComponent {
    #value;

    static get staticAttrs() {
        return ["nm-prop"];
    }

    static get defineProperty() {
        return {};
    }

    static get name() {
        return "nm-radio";
    }

    get clsName() {
        return NMRadio.name;
    }

    get styles() {
        return `
        .${this.clsName} {
            display: flex;
            gap: 4px;
        }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
        </div>`;
    }

    get value() {
        return this.#value;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CHECK, this.onCheck);
    }

    onCheck(e) {
        const { detail } = e;
        const { target, value } = { ...detail };

        this.setValue(value);
    }

    onChangeAttr(name, old, value) {
        if (name === "value") {
            this.setValue(value);
        }
    }

    setData(data) {
        this.clear();
        const wapper = util.DomUtil.querySelector(this, `.${this.clsName}`);

        if (!wapper) return;

        data.forEach((d) => {
            const radioUnit = new NMRadioUnit();
            wapper.append(radioUnit);
            radioUnit.$data = d;
        });
    }

    setValue(value) {
        const radioUnits = util.DomUtil.querySelectorAll(this, NMRadioUnit.name);
        radioUnits.forEach((unit) => {
            util.DomUtil.enableClass(unit, "check", unit.value === value);
        });

        const old = this.#value;
        this.#value = value;

        let type;

        if (util.CommonUtil.isNull(old)) {
            type = NMConst.actionName.INSERT;
        } else if (util.CommonUtil.isNull(value)) {
            type = NMConst.actionName.DELETE;
        } else {
            type = NMConst.actionName.UPDATE;
        }

        const p = {property: this["nm-prop"], old, value, type, target: this }
        util.EventUtil.dispatchEvent(this, NMConst.eventName.VALUE_CHANGE, p);
    }

    clear() {
        const units = util.DomUtil.querySelectorAll(this, NMRadioUnit.name);
        units.forEach((unit) => {
            unit.remove();
        });
    }
}

class NMRadioUnit extends NMComponent {
    #value;

    static get defineProperty() {
        return { class: "" };
    }

    static get name() {
        return "nm-radio-unit";
    }

    get clsName() {
        return NMRadioUnit.name;
    }

    get value() {
        return this.#value;
    }

    get styles() {
        return `
        .${this.clsName} {
            cursor: pointer;
            border-radius: 4px;
            --bg-color: white;
            --color: black;
            background-color: var(--bg-color);
            color: var(--color);
            padding: 0px 4px;

            &:hover {
                --bg-color: var(--pantone-frost-gray);
                --color: white;
            }

            &.check {
                --bg-color: var(--pantone-true-blue);
                --color: var(--pantone-bright-white);
            }
        }
        `;
    }

    get template() {
        return `
        <div class="${this.clsName}" part="${this.clsName}">
            <slot></slot>
        </div>
        `;
    }

    addEvent() {
        this.bindEvent(this, NMConst.eventName.CLICK, this.onClick);
    }

    onClick(e) {
        util.EventUtil.eventFilters([
            {
                condition: () => util.EventUtil.getDomFromEvent(e, this.clsName),
                callback: () => {
                    util.EventUtil.dispatchEvent(this, NMConst.eventName.CHECK, { value: this.#value, target: this });
                }
            }
        ]);

        e.preventDefault();
        e.stopPropagation();
    }

    onChangeAttr(name, old, value) {
        if (name === "class") {
            const wapper = util.DomUtil.querySelector(this, `.${this.clsName}`);
            wapper && (wapper.className = `${this.clsName} ${value}`);
        }
    }

    setData(data) {
        this.clear();
        const { title, range, value } = { ...data };
        const html = `<nm-label class="" value="${title}" range="${range}"></nm-label>`;
        this.#value = value;
        this.innerHTML = html;
    }

    clear() {
        this.innerHTML = ""
    }
}

define(NMRadio);
define(NMRadioUnit);
export { NMRadio, define };
