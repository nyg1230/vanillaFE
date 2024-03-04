import * as util from "core/js/util/utils";

class Store {
    #data;
    #toStore = true;

    get data() {
        return this.#data;
    }

    get toStore() {
        return this.#toStore;
    }

    constructor() {
        const [data, toStore = true] = [...arguments];
        this.#toStore = toStore;

        if (!util.CommonUtil.isObject(data) || !util.CommonUtil.isArray(data)) {
            this.#data = data;
        } else {
            const obj = new data.__proto__.constructor();

            Object.entries(data).forEach(([k, v]) => {
                obj[k] = new Store(v);
            });
        }
    }

    get(key) {
        let result;
        const store = util.CommonUtil.isEmpty(key) ? this : this.#data[key];
        const data = store && store.data;

        if (!util.CommonUtil.isObject(data) || !util.CommonUtil.isArray(data)) {
            result = data;
        } else {
            const obj = new data.__proto__.constructor();

            Object.entries(data).forEach(([k, v]) => (result[k] = v.get()));
        }
        

        return result;
    }

    set(key, data, returnValue = false, toStore = true) {
        this.#data[key] = new Store(data, toStore);
        if (returnValue === true) return this.#data[key];
    }

    add(data, key, toStore = true) {
        if (util.CommonUtil.isNull(this.#data) || !util.CommonUtil.isObject(this.#data)) {
        } else {
            if (util.CommonUtil.isArray(this.#data)) {
                this.#data.push(new Store(data, toStore));
            } else {
                this.#data[key] = new Store(data, toStore);
            }
        }
    }

    delete(key) {
        delete this.#data[key];
    }
}

const store = new Store({});

export default {
    get: (...args) => store.get(...args),
    set: (...args) => store.set(...args),
    add: (...args) => store.add(...args),
    delete: (...args) => store.delete(...args)
};
