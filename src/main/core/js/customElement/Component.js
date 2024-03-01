import * as util from "core/js/util/utils.js";

const store = util.StoreUtil.set("component", {}, true);

class Component extends HTMLElement {
    #proto = this.__proto__.constructor;
    #isRender = false;
    #options = this.$$options;
    #tree = {};
    #proxy;
    #oid;
    #root;
    #template;

    constructor() {
        super();

        this.#init(...arguments);
    }

    static get observedAttributes() { return []; }

    static get TAG_NAME() { return "custom-component"; }

    get $name() {
        return (() => this.#proto.TAG_NAME)();
    }

    get $proxy() { return this.#proxy; }

    get $options() { return this.#options; }

    get $$options() { return {}; }

    get $render() { return this.#isRender; }

    get $tree() { return this.#tree; }

    get $oid() { return this.#oid }

    get template() {
        return {
            tag: "div",
            attr: {
                className: this.className,
                part: this.clsName
            },
            prop: "",
            children: [
                { tag: "slot" }
            ]
        }
    }

    #init() {
        this.#oid = util.CommonUtil.generator("cid");
        store.add(this, this.#oid, false);

        const { options } = { ...arguments[0] };
        this.#initOptions(options);
    }

    #initOptions(options) {
        util.CommonUtil.deepMerge(this.#options, options);
    }

    #initBind() {
        this.bindEvent(this);
    }

    #addEvent() {
        this.addEvent();
    }

    addEvent() {}

    bindEvent(target, eventName, fn, options = {}) {
        util.EventUtil.bindEvent(target, eventName, fn, options);
    }

    #render() {
        this.#root = this.attachShadow({ mode: "open" });
        this.#template = util.TemplateUtil.getTemplate(this);
        
        const { frag } = { ...this.#template };
        this.#root.appendChild(frag);
    }

    #destroy() {
        this.destroy();
    }

    destroy() {
        store.delete(this.#oid);
    }

    connectedCallback() {
        this.#initBind();
        this.#addEvent();
        this.#render();
    }

    disconnectedCallback() {
        this.#destroy();
    }

    attributeChangedCallback() {
        this.#changeMapperAttr(...arguments);
    }

    #changeMapperAttr() {
        const [name, oldValue, newValue] = [...arguments];
        const { mapper } = { ...this.#template };
        const { attr = {} } = { ...mapper };

        try {
            const target = attr[name];
            target.forEach(([element, fn]) => {
                console.log(element, fn)
                element.setAttribute(name, fn(newValue));
            });
        } catch {}
    }

    ttt() {
        return this.#template;
    }
}

const define = (cls) => {
    customElements.define(cls.TAG_NAME, cls);
};

export { Component, define };
