const AopUtil = {
    before(target, props = [], fn) {
        const protoList = [];

        props.forEach((p) => {
            const proto = target.prototype[p];
            proto && protoList.push(p);
        });

        protoList.forEach((p) => {
            const self = target.prototype[p];
            target.prototype[p] = function() {
                fn.apply(this, arguments);
                self.apply(this, arguments);
            }
        });
    }
};

export default AopUtil;