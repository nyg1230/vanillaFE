import * as util from "core/js/util/utils.js";

const store = util.StoreUtil.get("event");
const compoennts = util.StoreUtil.get("component");

const EventUtil = {
    bindEvent(target, eventName, fn, options) {
        try {
            target.addEventListener(eventName, fn, options);
            const eid = util.CommonUtil.generator("eid");
            const info = {
                oid: target.$oid,
                eventName,
                fn,
                options
            };

            store.set(eid, info);
        } catch {}
    },
    unbindEvent() {},
    unbindEventById(eid) {
        const info = store.get(eid);

        if (util.CommonUtil.isNull(info)) return;

        const { oid, eventName, fn, options } = { ...info };
        const component = compoennts.get(oid);

        try {
            component.removeEventListener(eventName, fn, options);
            store.delete(eid);
        } catch {}
    }
};

export default EventUtil;