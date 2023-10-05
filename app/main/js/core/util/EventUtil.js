/* common */
import * as util from "/assets/js/core/util/utils.js";

const EventUtil = {
    createEvent(eventName, option = {}) {
        return new CustomEvent(eventName, option);
    },
    bindEvent(target, eventName, fn, option) {
        target.addEventListener(eventName, fn, option);
    },
    unbindEvent(target, eventName, fn, option) {
        target.removeEventListener(eventName, fn, option);
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
                if (reg.test(value)) result = dom;
            } else if (attr === "class") {
                if (util.DomUtil.hasClass(dom, [value])) result = dom;
            } else {
                const attrValue = target.getAttribute(attr);
                if (attrValue === value) result = dom;
            }

            if (result) break;
        }

        return result;
    }
}

export default EventUtil;