/* inherit */

/* common */
import * as util from "main/util/utils.js";

/* component */
import NMMain from "main/component/custom/main/NMMain.js";
// import CanvasTest from "./test/canvasTest.js";

/* constant */
import NMConst from "main/constant/NMConstant";

window.onload = (e) => {
    // console.log("test~!");
    // const test = new CanvasTest();

    const body = util.DomUtil.querySelector(document, "body");
    const main = new NMMain();

    body.appendChild(main);
}
