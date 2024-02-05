/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const convertMapper = {
    $Y: d => d.getFullYear(),
    $M: d => d.getMonth() + 1,
    $d: d => d.getDate(),
    $h: d => d.getHours(),
    $H: d => d.getHours() % 12,
    $m: d => d.getMinutes(),
    $s: d => d.getSeconds(),
    $ms: d => d.getMilliseconds(),
    $n: d => d.getHours() / 12 < 1 ? "AM" : "PM"
};

const timeUnit = {
    Y: 1000 * 60 * 60 * 24 * 30 * 12,
    M: 1000 * 60 * 60 * 24 * 30,
    d: 1000 * 60 * 60 * 24,
    h: 1000 * 60 * 60,
    m: 1000 * 60,
    s: 1000,
    ms: 1
};

const DateUtil = {
    timestampToString(timestamp, fromat, utc) {},
    dateToFormatString(date, format) {
        Object.entries(convertMapper).forEach(([k, fn]) => {
            format = format.replace(k, `${fn(date)}`.padStart(2, "0"));
        });

        return format;
    },
    converTimeStamp(num, from, to) {
        const fromUnit = timeUnit[from];
        const toUnit = timeUnit[to];

        const unit = fromUnit / toUnit;

        return num * unit;
    }
};

export default DateUtil;
