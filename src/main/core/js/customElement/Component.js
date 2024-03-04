import * as util from "core/js/util/utils.js";

const store = util.StoreUtil.set("component", {}, true);
const styleStore = util.StoreUtil.set("style", {}, true);

class Component extends HTMLElement {
    #o = {
        proto: this.__proto__.constructor,
        render: false,
        options: {},
        proxy: null,
        oid: null,
        root: null,
        swap: false,
        mapper: null,
        event: {}
    };

    get ttt() {
        return this.#o.mapper;
    }

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

    set $proxy(obj) {
        this.#setProxy(obj);
    }

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

    get styles() { return ""; }

    #init() {
        this.#o.oid = util.CommonUtil.generator("cid");
        store.add(this, this.#o.oid, false);

        const { options, parent } = { ...arguments[0] };
        this.#initOptions(options);
        this.#initProxy();
    }

    #initOptions(options) {
        util.CommonUtil.deepMerge(this.#o.options, options);
    }

    #initProxy() {
        const proxy = this.initProxy() || {};
        this.#o.proxy = proxy;
    }

    initProxy() {}

    #initBind() {
        // this.bindEvent(this);
    }

    #addEvent() {
        this.addEvent();
    }

    addEvent() {}

    bindEvent(target, eventName, fn, options = {}, duplication) {
        let oldEid = util.CommonUtil.find(this.#o, ["event", eventName]);
        
        if (util.CommonUtil.isNotEmpty(oldEid)) {
            util.EventUtil.unbindAllEventById(oldEid);
            delete this.#o.event[eventName];
        }
        
        const eid = util.EventUtil.bindEvent(target, eventName, fn, options);
        this.#o.event[eventName] = eid;
    }

    unbindEvent(eventName) {
        const list = util.CommonUtil.find(this.#o, ["event", eventName]);

        if (util.CommonUtil.isArray(list)) {
            util.EventUtil.unbindEventByIds(list.splice(0));
        }
    }

    unbindAllEvent() {
        const { event } = { ...this.#o };

        Object.keys(event).forEach((eventName) => {
            this.unbindEvent(eventName);
        });
    }

    #render() {
        this.beforeRender()
        this.#o.root = this.attachShadow({ mode: "open" });
        this.#o.mapper = util.TemplateUtil.getMapper(this);
        
        this.#initStyle();
        const { frag } = { ...this.#o.mapper };
        this.#o.root.appendChild(frag);
        this.#o.render = true;
        this.afterRender();
    }

    #initStyle() {
        util.StyleUtil.setGlobalStyle(this.#o.root);

        this.#setComponentStyle();
    }

    #setComponentStyle() {
        let sheet = styleStore.get(this.$name);

        if (!sheet) {
            sheet = util.StyleUtil.toStyleSheet(this.styles);
            styleStore.set(this.$name, sheet);
        }

        this.#o.root.adoptedStyleSheets.push(sheet);
    }

    beforeRender() {}
    afterRender() {}

    #destroy() {
        this.unbindAllEvent();
        store.delete(this.#o.oid);
        this.#o = null;
    }

    destroy() {}

    connectedCallback() {
        this.#initBind();
        this.#addEvent();
        this.#render();
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
        const { mapper } = { ...this.#o.mapper };
        const { subscribe = {} } = { ...mapper };

        try {
            const target = util.CommonUtil.find(subscribe, ["attrs", name]);
            target.forEach(([element, fn]) => {
                element.setAttribute(name, fn(newValue));
            });
        } catch {}
    }

    #setProxy(obj) {
        this.#setSubscribeProxy();
    }

    #setSubscribeProxy() {

    }
}

const define = (cls) => {
    customElements.define(cls.TAG_NAME, cls);
};

export { Component, define };
