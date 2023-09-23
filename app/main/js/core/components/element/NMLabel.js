/* inherit */
import { NMComponent, define } from "js/core/components/NMComponent.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

export default class NMLabel extends NMComponent {
    #text;

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

    get tooltip() {
        return this.getAttribute("tooltip");
    }

    set tooltip(tooltip) {
        this.setAttribute("tooltip", tooltip);
    }

    get type() {
        return this.getAttribute("type");
    }

    set type(type) {
        this.setAttribute("type", type);
    }

    get format() {
        return this.getAttribute("format");
    }

    set format(format) {
        this.setAttribute("format", format);
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

    afterRender() {
        const useTooltip = util.CommonUtil.toBoolean(this.tooltip);
        useTooltip && util.TooltipUtil.setTooltip(this, this.getTooltipText);
    }

    getText() {
        let param;
        let text;
        const type = this.type;

        if (type === "date") text = this.#getDateText();
        else text = this.#getTranslateText();

        this.#text = text;
        return this.#text;
    }

    #getTranslateText() {
        let param
        if (util.CommonUtil.isNotNull(this.param)) {
            param = this.param.split(",").map((a) => a.trim())
        }
        const text = util.TranslateUtil.translate(this.value, this.range, param) || this.value;
        return text;
    }

    #getDateText() {
        const date = new Date(this.value);
        const str = util.DateUtil.dateToFormatString(date, this.format);
        return str;
    }

    getTooltipText() {
        return this.#text;
    }

    setText(text) {
        this.textContent  = text;
    }

    onChangeLanguage() {
        const text = this.getText();
        this.setText(text);
    }

    onChangeAttr(name, old, value) {
        if (name === "value" || name === "range" || name === "type") {
            const text = this.getText();
            this.setText(text);
        }
    }
}

define(NMLabel);
