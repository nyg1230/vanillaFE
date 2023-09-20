/* inherit */
/* common */
import * as util from "main/util/utils.js";
import router from "main/router/core/NMRouter.js";
/* component */
import "main/components/core/element/elements.js";
/* constant */
import NMConst from "main/constant/NMConstant";

window.onload = (e) => {
    const body = util.DomUtil.querySelector(document, "body");
    const option = {
        mode: "hash"
    };
    router.setOption(option);
    router.setContainer(body);
    router.init();
}
