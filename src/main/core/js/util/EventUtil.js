import * as util from "core/js/util/utils.js";

const eventStore = util.StoreUtil.get("event");
const compStore = util.StoreUtil.get("component");

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

            eventStore.set(eid, info);
        } catch {}
    },
    unbindEvent() {},
    unbindEventById(eid) {
        const info = eventStore.get(eid);

        if (util.CommonUtil.isNull(info)) return;

        const { oid, eventName, fn, options } = { ...info };
        const component = compStore.get(oid);

        try {
            component.removeEventListener(eventName, fn, options);
            eventStore.delete(eid);
        } catch {}
    }
};

export default EventUtil;