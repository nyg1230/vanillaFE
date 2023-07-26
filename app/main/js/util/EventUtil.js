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
        const event = this.createEvent(eventName, { ...option, detail: param });
        target.dispatchEvent(event);
    }
}

export default EventUtil;