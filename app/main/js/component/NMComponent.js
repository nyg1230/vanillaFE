import * as util from "../util/utils.js";

class NMComponent extends HTMLElement {
    #root;
    #template;

    constructor() {
        super();
        console.log(this.clsName);
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

    addEvent() {}

    bindEvent(target, eventName, fn) {}

    attributeChangedCallback(name, oldValue, newValue) {}

    connectedCallback() {
        this.#render()
    }

    disconnectedCallback() {}

    #render() {
        this.#root = this.attachShadow({ mode: "open" });

        const clsConstructor = this.__proto__.constructor;

        let style;
        if (clsConstructor && clsConstructor.styles) {
            console.log(1);
            style = clsConstructor.styles;
        } else {
            console.log(2);
            style = util.DomUtil.createElement("style");
            style.textContent = this.styles;
            clsConstructor.styles = style;
        }

        this.#root.appendChild(style);

        const frag = document.createDocumentFragment();
        frag.textContent = this.template;

        this.#root.appendChild(frag);
    }
}

const define = (element) => {
    customElements.define(element.name, element);
};

export {
    NMComponent,
    define
};