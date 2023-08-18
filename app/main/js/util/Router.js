/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
import NMMain from "main/component/view/main/NMMain";

/**
 * pushState로 관린하기
 * url을 /로 split한 뒤 기존 라우터 패스를 비교하여 차례대로 append 하기
 * route 계층화 고민해보기
 */
const routerPath = [];
class Router {
    #route;

    constructor() {
        this.#init();
    }

    get route() {
        return this.#route;
    }

    #init() {

    }

    route(url = "") {
        const list = url.split("/");
    }
}

const route = {
    main: {
        class: NMMain,
        body: {},
        hoem: {
            class: "NMHome"
        }
    }
};

const router = new Router();

export default {
    get: () => {
        return router;
    }
}