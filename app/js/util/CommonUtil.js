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
        !this.isEmpty(obj)
    },
    length(obj) {
        let len = 0;

        if (this.isNull(obj)) {
        } else if (obj.hasOwnProperty("length")) {
            len = obj.length;
        } else if (this.isObject(len)) {
            len = Object.keys(obj).length;
        }

        return len;
    },

    round(num, round = 1, isPercent = false) {
        let result = 0;
        const corr = 10 ** round;
        const tmp = num * corr;
        result = Math.round(tmp) / corr;
        result = isPercent === true ? result * 100 : result;
        return result;
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
    }
};

export default CommonUtil;