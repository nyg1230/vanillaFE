const generator = {};

const CommonUtil = {
    generator(key, justNumber = false) {
        this.isNull(generator[key]) && (generator[key] = 0);
        const num = generator[key]++;
        return justNumber === true ? num : `${key}-${num}`
    },
    isArray(obj) {
        return Array.isArray(obj);
    },
    isFunction(obj) {
        return typeof obj === "function";
    },
    isObject(obj) {
        let result = false;

        try {
            result = obj.constructor === Object;
        } catch {}

        return result;
    },
    isString(obj) {
        return typeof obj === "string";
    },
    isNull(obj) {
        return obj === null || obj === undefined;
    },
    isNotNull(obj) {
        return !this.isNull(obj);
    },
    isEmpty(obj) {
        return this.isNull(obj) || this.length(obj) === 0;
    },
    isNotEmpty(obj) {
        return !this.isEmpty(obj)
    },
    length(obj) {
        let len = 0;

        if (this.isNull(obj)) {
        } else if (obj.hasOwnProperty("length")) {
            len = obj.length;
        } else if (this.isObject(obj)) {
            len = Object.keys(obj).length;
        }

        return len;
    },
    merge(isDeep = true, ...objects) {
        return isDeep === true ? this.deepMerge(objects) : this.shallowMerge(objects);
    },
    deepMerge() {
        const [obj, ...objs] = [...arguments];

        objs.forEach((o) => {
            if (this.isNull(o)) return;

            Object.entries(o).forEach(([k, v]) => {
                if (!this.isObject(v)) {
                    obj[k] = v;
                } else {
                    !obj[k] && (obj[k] = this.isArray(v) ? [] : {});
                    this.deepMerge(obj, v);
                }
            });
        });
    },
    shallowMerge() {},
    deepCopy(obj) {
        let root;

        if (this.isObject(obj) || this.isArray(obj)) {
            root = new obj.__proto__.constructor();

            Object.entries(obj).forEach(([k, v]) => {
                root[k] = this.deepCopy(v); 
            });
        } else {
            root = obj;
        }

        return root;
    }
};

export default CommonUtil;
