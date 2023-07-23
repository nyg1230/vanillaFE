const EventUtil = {
    bindEvent: (target, eventName, fn, option) => {
        target.addEventListener(eventName, fn, option);
    },
    unbindEvent: (target, eventName, fn, option) => {
        target.removeEventListener(eventName, fn, option);
    },
    dispatchEvet: () => {}
}

export default EventUtil;