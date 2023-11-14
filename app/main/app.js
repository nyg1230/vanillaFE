/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
import router from "js/core/router/NMRouter.js";
/* component */
import "js/core/components/element/elements.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

window.onload = (e) => {
    const body = util.DomUtil.querySelector(document, "body");
    const option = {
        mode: "hash"
    };
    util.StyleUtil.setGlobalStyles(document);
    router.setOption(option);
    router.setContainer(body);
    router.init();
}
