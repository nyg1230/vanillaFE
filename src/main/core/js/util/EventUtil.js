import * as util from "core/js/util/utils.js";

const eventStore = util.StoreUtil.get("event");

const EventUtil = {
    bindEvent(target, eventName, fn, options) {
        let eid;

        try {
            target.addEventListener(eventName, fn, options);
            eid = util.CommonUtil.generator("eid");
            const info = {
                oid: eid,
                target: target,
                eventName,
                fn,
                options
            };

            eventStore.set(eid, info);
        } catch {}

        return eid;
    },
    unbindEvent(info) {
        if (util.CommonUtil.isNull(info)) {
            return;
        }

        const { oid, target, eventName, fn, options } = { ...info };

        try {
            target.removeEventListener(eventName, fn, options);
            eventStore.delete(oid);
        } catch {}
    },
    unbindEventById(eid) {
        const info = eventStore.get(eid);
        this.unbindEvent(info);
    },
    unbindEventByIds(eids = []) {
        eids.forEach((eid) => {
            this.unbindEventById(eid);
        });
    }
};

export default EventUtil;