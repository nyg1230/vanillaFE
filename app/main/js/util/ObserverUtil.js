/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant";

class PropertyObserver {
    #object;
    #observeProperties;
    #id;

    constructor(target) {
        this.#object = target;
        this.#observeProperties = {};
        this.#id = 0;
    }

    getProperty(name) {
        this.#observeProperties[name];
    }

    observeAll() {}

    observe(key, fn) {
        if (!util.CommonUtil.isFunction(fn)) return;

        let property = this.getProperty(key);

        if (!property) {
            const isFunc = util.CommonUtil.isFunction(prop);
            const prop = this.get(key);
            property = {
                descriptor: Object.getOwnPropertyDescriptor(this.obj, propName),
                value: null,
                subscriber: []
            };
    
            property.obs = prop;
    
            if (isFunc) {
                Object.defineProperty(this.#object, key, {
                    value: (...params) => {
                        const result = property.obs.apply(this, params);
                        if (params.length > 0) {
                            property.subscriber.forEach((p) => p.callback(result));
                        }
    
                        return result;
                    },
                    enumerable: true,
                    configurable: true,
                    writeable: true
                })
            } else {
                Object.defineProperty(this.#object, key, {
                    get: () => property.value,
                    set: (v) => {
                        property.obs = v;
                        property.subscriber.forEach((s) => s.fn(v))
                    },
                    enumerable: true,
                    configurable: true,
                    writeable: true
                })
            }
        }

        const obj = { id: this.#id++, fn };
        property.subscriber.push(obj);
    }

    disconnect(name, idList) {
        const property = this.getProperty(name);

        if (!property) return;

        let clear = util.CommonUtil.isEmpty(idList);
        if (!clear) {
            idList.forEach((id) => {
                const idx = property.subscriber.findIndex((s) => s.id == id);
                idx > -1 && property.subscriber.splice(idx, 1);
            });
            
            clear = util.CommonUtil.isEmpty(property.subscriber);
        }

        if (clear) {
            property.descriptor && Object.defineProperty(this.#object, name, property.descriptor);
            delete this.#observeProperties[name];
        }
    }

    destroy() {
        this.#object = null;
        this.#observeProperties = null;
        this.#id = null;
    }
}

const ObserverUtil = {
    propertyObserver(target, key, fn, option) {
        if (!target) return;

        const isFunction = util.CommonUtil.isFunction(target[key]);
        const prefix = "propObserver_";
        const name = `${prefix}${key}`;
        target[name] = target[key];

        if (isFunction) {
            Object.defineProperty(target, key, {
                get: function(...v) {
                    return target[name](...v);
                },
                set: function() {

                }
            });
        } else {
            Object.defineProperty(target, key, {
                get: function() {
                    return this[name];
                },
                set: function(v) {
                    target[name] = v;
                    util.CommonUtil.isFunction(fn) && fn(v);
                }
            });
        }
    }
};

export default {
    ObserverUtil
};
