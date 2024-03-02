import * as util from "core/js/util/utils.js";

const store = util.StoreUtil.set("component", {}, true);

class Component extends HTMLElement {
    #o = {
        proto: this.__proto__.constructor,
        render: false,
        options: {},
        proxy: null,
        oid: null,
        root: null,
        template: null,
        swap: false,
        mapper: null
    };

    constructor() {
        super();

        this.#init(...arguments);
    }

    static get observedAttributes() { return []; }

    static get TAG_NAME() { return "custom-component"; }

    get $name() {
        return (() => this.#o.proto.TAG_NAME)();
    }

    get $proxy() { return this.#o.proxy; }

    get $options() { return this.#o.options; }

    get $$options() { return {}; }

    get $render() { return this.#o.render; }

    get $tree() { return this.#o.tree; }

    get $oid() { return this.#o.oid }

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
        this.#o.oid = util.CommonUtil.generator("cid");
        store.add(this, this.#o.oid, false);

        const { options } = { ...arguments[0] };
        this.#initOptions(options);
    }

    #initOptions(options) {
        util.CommonUtil.deepMerge(this.#o.options, options);
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
        this.#o.root = this.attachShadow({ mode: "open" });
        this.#o.mapper = util.TemplateUtil.getMapper(this);
        
        const { frag } = { ...this.#o.mapper };
        this.#o.root.appendChild(frag);
    }

    #destroy() {
        store.delete(this.#o.oid);
        this.#o = null;
    }

    destroy() {}

    connectedCallback() {
        this.#initBind();
        this.#addEvent();
        this.#render();

        this.#o.render = true;
    }

    disconnectedCallback() {
        if (this.#o.swap === false) {
            this.destroy();
            this.#destroy();
        }
    }

    attributeChangedCallback() {
        this.#changeMapperAttr(...arguments);

        const [name, oldValue, newValue] = [...arguments];

        let type;

        if (util.CommonUtil.isNull(oldValue)) {
            type = "insert";
        } else if (util.CommonUtil.CommonUtil.isNull(newValue)) {
            type = "delete";
        } else if (oldValue === newValue) {
            type = "equal";
        } else {
            type = "update";
        }

        const param = {
            detail: {
                oldValue: oldValue,
                value: newValue,
                name: name,
                type: type
            }
        };
        this.onChangeAttr(param)
    }

    onChangeAttr() {}

    #changeMapperAttr() {
        const [name, oldValue, newValue] = [...arguments];
        const { mapper } = { ...this.#o.template };
        const { subscribe = {} } = { ...mapper };

        try {
            const target = util.CommonUtil.find(subscribe, ["attrs", name]);
            target.forEach(([element, fn]) => {
                element.setAttribute(name, fn(newValue));
            });
        } catch {}
    }
}

const define = (cls) => {
    customElements.define(cls.TAG_NAME, cls);
};

export { Component, define };
