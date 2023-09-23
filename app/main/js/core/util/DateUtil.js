/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const convertMapper = {
    $Y: d => d.getFullYear(),
    $M: d => d.getMonth() + 1,
    $d: d => d.getDay() + 1,
    $h: d => d.getHours(),
    $H: d => d.getHours() % 12,
    $m: d => d.getMinutes(),
    $s: d => d.getSeconds(),
    $ms: d => d.getMilliseconds(),
    $n: d => d.getHours() / 12 < 1 ? "AM" : "PM"
}

const DateUtil = {
    timestampToString(timestamp, fromat, utc) {},
    dateToFormatString(date, format) {
        Object.entries(convertMapper).forEach(([k, fn]) => {
            format = format.replace(k, `${fn(date)}`.padStart(2, "0"));
        });

        return format;
    }
};

export default DateUtil;
