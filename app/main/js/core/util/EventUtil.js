/* common */
import * as util from "js/core/util/utils.js";

const EventUtil = {
    createEvent(eventName, option = {}) {
        return new CustomEvent(eventName, option);
    },
    bindEvent(target, eventName, fn, option) {
        if (util.CommonUtil.isFunction(fn)) {
            target.addEventListener(eventName, fn, option);
        }
    },
    unbindEvent(target, eventName, fn, option) {
        if (util.CommonUtil.isFunction(fn)) {
            target.removeEventListener(eventName, fn, option);
        }
    },
    dispatchEvent(target, eventName, param, option) {
        const p = {
            bubbles: true,
            cancelable: true,
            composed: true,
            ...option,
            detail: param
        };

        const event = this.createEvent(eventName, p);
        target.dispatchEvent(event);
    },
    getDomFromEvent(e, value, attr = "tag", max = 10) {
        const path = e.composedPath();
        let result;
        value = `${value}`;

        for (let idx = 0; idx < max; idx++) {
            const dom = path[idx];

            if (attr === "tag") {
                const reg = new RegExp(value, "i");
                const { tagName } = dom;
                if (reg.test(tagName)) result = dom;
            } else if (attr === "class") {
                if (util.DomUtil.hasClass(dom, [value])) result = dom;
            } else {
                const attrValue = target.getAttribute(attr);
                if (attrValue === value) result = dom;
            }

            if (result) break;
        }

        return result;
    },
    eventFilters(list = []) {
        const len = util.CommonUtil.length(list);

        for (let idx = 0; idx < len; idx++) {
            const filter = list[idx];
            const { condition, callback, justOne } = filter;
            const result = util.CommonUtil.execute(condition);
            
            if (result) {
                util.CommonUtil.isFunction(callback) && callback(result);
                break;
            }
        }
    }
}

export default EventUtil;