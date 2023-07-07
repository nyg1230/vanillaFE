import * as util from "../util/Utils.js";

const defaultCount = 100;

const AnimationUtil = {
    getAnimation(type, speed, use = true) {
        let ani;

        if (use === false) {
            ani = this.constant(1);
        } else {
            const fn = this[type] || this.constant;
            
            let corr;
            if (speed === "slow") {
                corr = 2
            } else if (speed === "fast") {
                corr = 1 / 2;
            } else {
                corr = 1
            }

            ani = fn(defaultCount * corr);
        }

        return ani;
    },

    larghissimo() {
        return this.constant(defaultCount * 4);
    },

    moderato() {
        return this.constant();
    },

    prestissimo() {
        return this.constant(defaultCount / 4);
    },

    constant(count = defaultCount) {
        const tick = util.CommonUtil.round(1 / count, 12);
        const arr = [];
        for (let idx = 1; idx <= count; idx++) {
            const v = idx * tick;
            arr.push(v);
        }

        return arr;
    },
    
    slowly(count = defaultCount, corr = 1 / 5) {
        const tick = util.CommonUtil.round((Math.E - 1) / count, 12);
        const arr = [];
        for (let idx = 1; idx <= count; idx++) {
            const v = Math.log(idx * tick + 1) ** corr;
            arr.push(v);
        }

        return arr;
    },

    rapidly(count = defaultCount, corr = 5) {
        const tick = util.CommonUtil.round(1 / count, 12);
        const arr = [];
        for (let idx = 1; idx <= count; idx++) {
            const v = (idx * tick) ** corr;
            arr.push(v);
        }

        return arr;
    }
};

export default AnimationUtil;
