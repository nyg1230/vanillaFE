import * as util from "core/js/util/utils.js";

const store = util.StoreUtil.get("component");

class Component extends HTMLElement {
    #proto = this.__proto__;
    #isRender = false;
    #options = this.$$options;
    #tree = {};
    #proxy;
    #oid;

    constructor() {
        super();

        this.#init(...arguments);
    }

    static get observedAttributes() { return []; }

    static get TAG_NAME() { return "custom-component"; }

    static get $$attrs() { return []; }

    get $name() { return (() => this.__proto__.name)(); }

    get $proxy() { return this.#proxy; }

    get $options() { return this.#options; }

    get $$options() { return {}; }

    get $render() { return this.#isRender; }

    get $tree() { return this.#tree; }

    get $oid() { return this.#oid }

    get template() {
        return {
            tag: "",
            attr: {
                className: "a b c",
                value: "123"
            },
            prop: {},
            children: [
                {}
            ]
        }
    }

    #init() {
        this.#oid = util.CommonUtil.generator("cid");
        store.set(this.#oid, this);
        console.log(store.get())
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
        if (!target) return;
        util.EventUtil.bindEvent(target, eventName, fn, options);
    }

    #render() {}

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

    attributeChangedCallback() {}
}

const define = (cls) => {
    customElements.define(cls.TAG_NAME, cls);
};

export { Component, define };
