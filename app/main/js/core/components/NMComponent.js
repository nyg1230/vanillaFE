/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMComponent extends HTMLElement {
    #root;
    #rect;
    #event = {}
    #data;
    #isRender = false;
    #invoke = {};

    constructor(params = {}) {
        super();

        Object.entries(params).filter(([k, v]) => {
            this[k] = v;
        });

        this.init();
    }

    static get staticAttrs() {
        return [];
    }

    static get defineProperty() {
        return {};
    }
    
    static get observedAttributes() {
        const attrs = [];
        Object.keys(this.defineProperty).forEach((key) => attrs.push(key));
        return attrs;
    }

    static get name() {
        return "nm-component";
    }

    get clsName() {
        return NMComponent.name;
    }

    get rect() {
        return this.#rect;
    }

    get styles() {
        return ``;
    }

    get template() {
        return ``;
    }

    get $data() {
        return this.#data;
    }

    set $data(data) {
        this.#setData(data);
    }

    get #proto() {
        return this.__proto__.constructor;
    }

    init() {
        const proto = this.#proto;
        Object.entries(proto.defineProperty).forEach(([key, defaultValue]) => {
            Object.defineProperty(this, key, {
                get: () => {
                    let value = this.getAttribute(key);

                    if (!value) {
                        try {
                            value = defaultValue.call(this);
                        } catch {
                            value = defaultValue;
                        }
                    }

                    return value;
                },
                set: (v) => this.setAttribute(key, v)
            })
        });

        proto.staticAttrs.forEach((attr) => {
            const v = this.getAttribute(attr);
            this.removeAttribute(attr);

            Object.defineProperty(this, attr, {
                get: () => v
            });
        });
    }

    isRender() {
        return this.#isRender;
    }

    invoke(type, condition, params, stroe = false) {
        !this.#invoke[type] && (this.#invoke[type] = []);

        if (util.CommonUtil.isFunction(condition)) {
            condition = condition();
        } else if (util.CommonUtil.isString(condition)) {
            condition = this[condition]();
        }

        const target = this.#invoke[type];

        if (condition) {
            this.#executeInvoke(params);
        } else {
            target.push(params);
            if (stroe) {
                let invoke = util.store.get("invoke", type);
                if (!util.CommonUtil.isArray(invoke)) {
                    util.store.set("invoke", type, []);
                    invoke = util.store.get("invoke", type);
                }

                invoke.push(this);
            }
        }
    }

    #executeInvoke(params) {
        const { scope = this, arg, fn } = { ...params };

        let func = util.CommonUtil.isString(fn) ? scope[fn] : fn;
        func.apply(scope, arg);
    }

    executeInvoke(type) {
        const params = this.#invoke[type];
        delete this.#invoke[type];

        params.forEach((d) => {
            this.#executeInvoke(d);
        });
    }
    
    flushInvoke() {
        Object.keys(this.#invoke).forEach((type) => {
            this.executeInvoke(type);
        });
    }

    connectedCallback() {
        this.#initBind();
        this.#addEvent();
        this.#render();
        this.flushInvoke();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const p = {
            arg: [name, oldValue, newValue],
            fn: this.onChangeAttr
        };
        this.invoke("attr", this.#isRender, p);
    }

    disconnectedCallback() {
        this.#destroy();
    }

    #initBind() {
        this.bindEvent(this, NMConst.eventName.VALUE_CHANGE, this.onValueChange);
        this.initBind();
    }

    initBind() {}

    onValueChange() {}

    #addEvent() {
        this.addEvent();
    }

    addEvent() {}

    /**
     * 대상에 이벤트를 바인딩하는 함수
     * 이벤트 정보는 차후 삭제를 위해 따로 저장함
     * @param {HTMLElement} target      이벤트 바인딩을 할 대상
     * @param {String}      eventName   등록할 이벤트 이름
     * @param {Function}    fn          이벤트 발생 시 수행할 함수
     * @param {Object}      option      이벤트 등록시 추가할 옵션
     */
    bindEvent(target, eventName, fn, option = {}) {
        if (!util.CommonUtil.isFunction(fn)) return;

        let eventList = util.CommonUtil.find(this.#event, `${eventName}`);

        if (util.CommonUtil.isEmpty(eventList)) {
            this.#event[eventName] = []
            eventList = this.#event[eventName];
        } else {
            const event = eventList.find((o) => o.target === target);
            if (event) {
                const { target } = { ...event };
                this.unbindEvent(target, eventName);
            }
        }

        fn = fn.bind(this);
        util.EventUtil.bindEvent(target, eventName, fn, option);
        const evtObejct = { target, eventName, fn, option };

        eventList.push(evtObejct);
    }

    /**
     * 대상에 바인딩 되어있는 이벤트를 삭제하는 함수
     * 이벤트 등록 시 저장한 정보를 기반으로 찾아서 삭제함
     * @param {HTMLElement} target      이벤트 삭제할 대상
     * @param {String}      eventName   삭제할 이벤트 이름
     */
    unbindEvent(target, eventName) {
        const eventList = util.CommonUtil.find(this.#event, `${eventName}`, []);
        const idx = eventList.findIndex((o) => o.target === target);

        if (idx > -1) {
            const event = eventList[idx];
            const { target, eventName, fn, option } = { ...event };
            util.EventUtil.unbindEvent(target, eventName, fn, option);
            eventList.splice(idx, 1);
        }
    }

    /**
     * 해당 컴포넌트에 바인딩된 모든 이벤트를 삭제함
     * 저장한 이벤트 정보를 기반으로 모두 찾아서 삭제
     */
    unbindEventAll() {
        Object.entries(this.#event).forEach(([eventName, eventList]) => {
            eventList.forEach((event) => {
                const { target, fn, option } = { ...event };
                util.EventUtil.unbindEvent(target, eventName, fn, option);
            });
        });
        this.#event = {};
    }
    /* component event function end */

    /* component attribute observe function start */
    onChangeAttr() {}
    /* component attribute observe function end */

    /* component renderring function start */
    /**
     * style, template을 가져와서 documentFragment에 두 대상을 추가함
     * shadowDom을 생성하고 해당 root에 fragment를 추가함
     */
    #render() {
        this.#beforeRender();
        if (!this.#root) {
            this.#root = this.attachShadow({ mode: "open" });
            util.StyleUtil.setGlobalStyles(this.#root);
        }
        const frag = document.createDocumentFragment();

        const style = this.#getStyle();
        const template = this.#getTemplate();

        frag.appendChild(style);
        frag.appendChild(template.content);

        this.#root.appendChild(frag);
        this.#isRender = true;
        this.#afterRender();
    }

    #beforeRender() {
        this.beforeRender();
    }
    beforeRender() {}
    #afterRender() {
        this.setRect();
        this.afterRender();
    }
    afterRender() {}

    /**
     * component의 size를 게산하여 변수로 선언 및 초기화하는 함수
     */
    setRect() {
        const rect = this.getBoundingClientRect();
        const { x, y, width, height } = rect;
        this.#rect = new DOMRectReadOnly(x, y, width, height);
    }

    /**
     * 컴포넌트에 데이터를 등록하고 그에 따른 후행 작업
     * @param {Object} data 컴포넌트에 사용할 데이터
     */
    #setData(data) {
        this.#data = data;
        this.invoke("data", this.#isRender, {
            arg: [this.#data],
            fn: this.setData
        });
    }

    // 하위에서 재정의하여 사용
    setData(data) {}

    /**
     * 컴포넌트가 기본적으로 사용할 style sheet를 반환하는 함수
     * 캐시 처리를 위하여 생성 후 proto에 직접 달아 주어서
     * 이후 컴포넌트 생성시에는 proto에서 꺼내서 사용함
     * @returns StyleSheet 객체
     */
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

    /**
     * 컴포넌트가 기본적으로 사용할 template 객체를 반환하는 함수
     * 캐시 처리를 위하여 생성 후 proto에 template을 달아줌
     * 차후 컴포넌트 생성시에는 proto에서 꺼내서 사용함
     * @returns Template tag 객체
     */
    #getTemplate() {
        // const proto = this.#proto;

        // if (!proto.template) {
        //     const tmpl = util.DomUtil.createElement("template");
        //     tmpl.innerHTML = this.template;
        //     proto.template = tmpl;
        // }

        // const template = proto.template.cloneNode(true);

        const tmpl = util.DomUtil.createElement("template");
        tmpl.innerHTML = util.CommonUtil.isFunction(this.template) ? this.template() : this.template;
        const template = tmpl;

        return template;
    }

    refresh() {
        while (this.#root.firstElementChild) {
            this.#root.firstElementChild.remove();
        };
        this.#render();
    }
    /* component renderring function end */

    /* componeent common function start */
    setPropertyData(data = {}, root = true) {
        Object.entries(data).forEach(([k, v]) => {
            const nodes = util.DomUtil.querySelectorAll(this, `[nm-${k}]`, root);
            nodes.forEach((node) => {
                const attr = node.getAttribute(`nm-${k}`);
                node[attr] = v;
            });
        });
    }
    /* componeent common function end */
    
    /* component remove function start */
    /**
     * 컴포넌트가 삭제될 때 무조건 호출하는 함수
     * 삭제 시 반드시 해야할 작업을 추가함
     * ex) 이벤트 삭제
     */
    #destroy() {
        util.ObserverUtil.disconnectAll(this);
        this.unbindEventAll();
        this.destroy();
    }

    /**
     * 상속받는 객체에서 삭제 시 추가적인 행위를 위하면 해당 함수를 사용함
     */
    destroy() {}
    /* component remove function end */
}

const define = (element) => {
    customElements.define(element.name, element);
};

export { NMComponent, define };
