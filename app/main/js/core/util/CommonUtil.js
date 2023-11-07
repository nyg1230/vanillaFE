const CommonUtil = {
    isArray(obj) {
        return Array.isArray(obj);
    },
    isFunction(obj) {
        return typeof obj === "function";
    },
    isObject(obj) {
        return typeof obj === "object";
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

    toBoolean(obj) {
        const bool = `${obj}` === "true";
        return bool;
    },

    approximation(type, num, round, isPercent = false) {
        let result = 0;
        const corr = 10 ** round;
        const tmp = num * corr;
        result = Math[type](tmp) / corr;
        result = isPercent === true ? result * 100 : result;
        return result;
    },

    round(num, round = 1, isPercent = false) {
        return this.approximation("round", num, round, isPercent);
    },

    ceil(num, round = 1, isPercent = false) {
        return this.approximation("ceil", num, round, isPercent);
    },

    floor(num, round = 1, isPercent = false) {
        return this.approximation("floor", num, round, isPercent);
    },

    toPercent(number, round = 2) {
        return this.round(number * 100, round);
    },

    requestAnimationFrame(target, prop) {
        const name = "___reqani";

        target[name] && window.cancelAnimationFrame(target[name]);
        target[name] = window.requestAnimationFrame(target[prop].bind(target));
    },

    cancelAnimationFrame(target, prop) {
        const name = "___reqani";

        target[name] && window.cancelAnimationFrame(target[name]);
        window.cancelAnimationFrame(target[prop]);
    },

    find(obj, key, defaultValue) {
		let result;
		if (this.isString(key)) key = key.split(".");

		if (this.isNull(obj)) {
			obj = result;
		} else {
			result = obj;
			for (let idx = 0; idx < key.length; idx++) {
				const k = key[idx];

				result = result[k];

				if (this.isNull(result)) {
					result = defaultValue;
					break;
				}
			}
		}
		return result;
	},

    debounce(target, prop, param, option) {
        const { delay = 300 } = { ...option };
        const key = `__debounce_${prop}`;

        
        const fn = () => {
            target[key] = window.setTimeout(() => {
                target[key] = null;
                target[prop].apply(target, param);
            }, delay);
        };
        
        if (!target[key]) {
            fn();
        } else {
            window.clearTimeout(target[key]);
            fn();
        }
    },

    throttle(target, prop, param, option) {
        const key = `__throttle_${prop}`;

        if (!target[key]) {
            const fn = () => {
                target[key] = true;
                target[prop].apply(target, param);
                target[key] = null;
            };
            fn();
        }
    },

    merge(o0, o1) {
        if (this.isNotNull(o1)) {
            Object.keys(o1).forEach((k) => {
                const v0 = o0[k];
                const v1 = o1[k];
    
                if (this.isNotNull(v0) && (this.isArray(v1) || this.isObject(v1))) {
                    this.merge(o0[k], o1[k]);
                } else {
                    o0[k] = v1;
                }
            });
        }
    },

    deepMerge(obj, ...objs) {
        objs.forEach((o) => {
            this.merge(obj, o);
        });

        return obj;
    },

    shallowMerge(obj, ...objs) {
        const tmp = { ...obj };

        objs.forEach((o) => {
            this.merge(tmp, o);
        });

        return tmp;
    },

    modulo(a, b) {
        let result = a % b;
        result = result < 0 ? result + b : result;
        return result;
    }
};

export default CommonUtil;