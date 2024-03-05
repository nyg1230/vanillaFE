import * as util from "core/js/util/utils.js";

const ProxyUtil = {
    create(data = {}, comp) {
        let proxy;

        // console.log(data);
        if (util.CommonUtil.isObject(data)) {
            proxy = new ObjectProxy(data, comp);
        } else if (util.CommonUtil.isArray(data)) {
            proxy = new ArrayProxy(data, comp);
        } else {
            proxy = new PrimitiveProxy(data, comp);
        }

        return proxy;
    }
};

class ObjectProxy {
    constructor(data, comp) {
        const proxy = this.create(data, comp);
        return proxy;
    }

    create(data, comp) {
        Object.keys(data).forEach((k) => {
            data[k] = ProxyUtil.create(data[k], comp);
        });

        const proxy = new Proxy(data, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                console.log(target[prop])
                const proxy = ProxyUtil.create(value, comp);
                Reflect.set(target, prop, proxy, receiver);

                return true;
            },
            defineProperty(target, prop) {
                delete target[prop];
            }
        });

        return proxy;
    }
}

class ArrayProxy {
    constructor(data, comp) {
        const proxy = this.create(data, comp);
        return proxy;
    }

    create(data, comp) {
        data = data.map((d) => ProxyUtil.create(d));

        const proxy = new Proxy(data, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                const proxy = ProxyUtil.create(value, comp);
                Reflect.set(target, prop, proxy, receiver);

                return true;
            }
        });

        return proxy;
    }
}

class PrimitiveProxy {
    constructor(data, prop) {
        const proxy = new Proxy({ value: data }, {
            get(target, prop, receiver) {
                return target.value;
            },
            set(target, prop, value, receiver) {
                target.value = value;
            }
        });

        return proxy;
    }
}

export default ProxyUtil