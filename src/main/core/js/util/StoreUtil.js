import * as util from "core/js/util/utils";

class Store {
    #store = {};

    constructor() {}

    get(key) {
        util.CommonUtil.isNull(this.#store[key]) && (this.#store[key] = new StoreObject());
        return this.#store[key];
    }

    set(key, value) {
        this.#store[key] = new StoreObject(value);
    }

    delete(key) {
        delete this.#store[key];
    }
}

class StoreObject {
    #data;

    constructor(d) {
        this.#data = d;
    }

    get() {
        return this.#data;
    }

    set(value) {
        this.#data = value;
    }
}

const store = new Store();

export default {
    get: (...args) => store.get(...args),
    set: (...args) => store.set(...args)
};
