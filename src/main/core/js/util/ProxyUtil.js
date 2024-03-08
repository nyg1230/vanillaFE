import * as util from "core/js/util/utils.js";

const ProxyUtil = {
    create(data = {}, comp) {
        let proxy;

        if (this.isProxy(data)) {
            proxy = data;
            this.addRef(data, comp);
        } else if (util.CommonUtil.isObject(data)) {
            proxy = new ObjectProxy(data, comp);
        } else if (util.CommonUtil.isArray(data)) {
            proxy = new ArrayProxy(data, comp);
        } else {
            proxy = new PrimitiveProxy(data, comp);
        }

        return proxy;
    },
    get() {
        const [target, p, receiver] = [...arguments];
        let result = Reflect.get(...arguments);

        if (result instanceof PrimitiveProxy) {
            result = result[p];
        }

        return result;
    },
    set() {
        const [target, p, v, receiver] = [...arguments];
        const proxy = this.create(v);
        Reflect.set(target, p, proxy, receiver);
    },
    isProxy(obj) {
        return obj instanceof ObjectProxy || obj instanceof ArrayProxy || obj instanceof PrimitiveProxy;
    },
    addRef(data, comp) {
        console.log(data, comp);
    }
};

class ObjectProxy {
    #ref = []

    constructor(data, comp) {
        this.$addRef(comp.$oid);

        Object.entries(data).forEach(([k, v]) => {
            this[k] = ProxyUtil.create(v, comp);
        });

        return new Proxy(this, {
            get: (target, p, receiver) => {
                return ProxyUtil.get(target, p, receiver);
            },
            set: (target, p, v, receiver) => {
                ProxyUtil.set(target, p, v, receiver, comp);
            }
        })
    }

    $getRef() {
        return this.#ref;
    }

    $addRef(cid) {
        this.#ref.push(cid);
    }
}

class ArrayProxy extends Array {
    #ref = []

    constructor(data, comp) {
        super();

        data.forEach((d) => this.push(ProxyUtil.create(d, comp)));

        return new Proxy(this, {
            get: (target, p, receiver) => {
                return ProxyUtil.get(target, p, receiver);
            },
            set: (target, p, v, receiver) => {
                ProxyUtil.set(target, p, v, receiver, comp);
            }
        });
    }

    $getRef() {
        return this.#ref;
    }

    $addRef(cid) {
        this.#ref.push(cid);
    }
}

class PrimitiveProxy {
    #value;
    #ref = []

    constructor(data, prop) {
        this.set(data);

        return new Proxy(this, {
            get(target, prop, receiver) {
                return target.get();
            },
            set(target, prop, value, receiver) {
                target.set(value);
            }
        });
    }

    get() {
        return this.#value;
    }

    set(value) {
        this.#value = value;
    }

    $getRef() {
        return this.#ref;
    }

    $addRef(cid) {
        this.#ref.push(cid);
    }
}

export default ProxyUtil