/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant";

class NMComponent extends HTMLElement {
    #root;

    constructor() {
        super();
    }
    
    static get observedAttributes() {
        return [];
    }

    static get name() {
        return "nm-component";
    }

    get clsName() {
        return NMComponent.name;
    }

    get styles() {
        return ``;
    }

    get template() {
        return ``;
    }

    get #proto() {
        return this.__proto__.constructor;
    }

    addEvent() {}

    bindEvent(target, eventName, fn) {}

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
        this.#render()
    }

    disconnectedCallback() {}

    #render() {
        this.#root = this.attachShadow({ mode: "open" });
        const frag = document.createDocumentFragment();

        const style = this.#getStyle();
        const template = this.#getTemplate();

        frag.appendChild(style);
        frag.appendChild(template.content);

        this.#root.appendChild(frag);
    }

    #getStyle() {
        const proto = this.#proto;

        if (!proto.styles) {
            const tmpl = util.DomUtil.createElement("style");
            tmpl.textContent = this.styles;
            proto.styles = tmpl;
        }

        const style = proto.styles.cloneNode(true);

        return style;
    }

    #getTemplate() {
        const proto = this.#proto;

        if (!proto.template) {
            const tmpl = util.DomUtil.createElement("template");
            tmpl.innerHTML = this.template;
            proto.template = tmpl;
        }

        const template = proto.template.cloneNode(true);

        return template;
    }
}

const define = (element) => {
    customElements.define(element.name, element);
};

export {
    NMComponent,
    define
};