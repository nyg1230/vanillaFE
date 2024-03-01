import * as util from "core/js/util/utils";

class Store {
    #data;

    get data() {
        return this.#data;
    }

    constructor() {
        const [data, toStore = true] = [...arguments];

        if (util.CommonUtil.isNull(data) || !util.CommonUtil.isObject(data) || toStore === false) {
            this.#data = data;
        } else {
            const obj = util.CommonUtil.isArray(data) ? [] : {};

            Object.entries(data).forEach(([k, v]) => {
                obj[k] = new Store(v);
            });

            this.#data = obj;
        }
    }

    get(key) {
        let result;
        const data = util.CommonUtil.isEmpty(key) ? this.#data : this.#data[key];
        const _data = data && !!key && data.data ? data.data : data;

        if (util.CommonUtil.isNull(_data) || !util.CommonUtil.isObject(_data) || (_data instanceof HTMLElement)) {
            result = data;
        } else {
            result = util.CommonUtil.isArray(data) ? [] : {};

            Object.entries(data).forEach(([k, v]) => (result[k] = v.get()))
        }

        return result;
    }

    set(key, data, returnValue = false, toObject = true) {
        this.#data[key] = new Store(data, toObject);
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
