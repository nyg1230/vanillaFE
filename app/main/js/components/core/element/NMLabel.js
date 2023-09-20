/* inherit */
import { NMComponent, define } from "main/components/core/NMComponent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant.js";

export default class NMLabel extends NMComponent {
    static get observedAttributes() {
        return ["value", "type", "param"];
    }

    static get name() {
        return "nm-label";
    }

    get clsName() {
        return NMLabel.name;
    }

    get styles() {
        return `
        .${this.clsName} {}
        `;
    }

    get template() {
        return `<span class="${this.clsName}" part="${this.clsName}"><slot></slot></span>`;
    }

    get value() {
        return this.getAttribute("value");
    }

    set value(value) {
        this.setAttribute("value", value);
    }

    get range() {
        return this.getAttribute("range") || "common";
    }

    set range(range) {
        this.setAttribute("range", range)
    }

    get param() {
        return this.getAttribute("param");
    }

    set param(param) {
        this.setAttribute("param", param);
    }

    addEvent() {
        this.bindEvent(window, NMConst.eventName.CHANGE_LANGUAGE, this.onChangeLanguage);
    }

    getText() {
        let param;
        if (util.CommonUtil.isNotNull(this.param)) {
            param = this.param.split(",").map((a) => a.trim())
        }
        const text = util.TranslateUtil.translate(this.value, this.range, param) || this.value;
        return text;
    }

    setText(text) {
        this.textContent  = text;
    }

    onChangeLanguage() {
        const text = this.getText();
        this.setText(text);
    }

    onChangeAttr(name, old, value) {
        if (name === "value" || name === "range") {
            const text = this.getText();
            this.setText(text);
        }
    }
}

define(NMLabel);
