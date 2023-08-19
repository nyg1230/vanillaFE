/* inherit */
/* common */
import * as util from "main/util/utils.js";
import route from "main/router/custom/route.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

/**
 * pushState로 관린하기
 * url을 /로 split한 뒤 기존 라우터 패스를 비교하여 차례대로 append 하기
 * route 계층화 고민해보기
 */
const routePath = [];
class NMRouter {
    #route = route;
    #_mode;
    #baseUrl = NMConst.env.baseUrl;
    #container;
    #allowMode = ["hash", "history"];

    constructor() {
        this.#init();
    }

    get route() {
        return this.#route;
    }

    get #mode() {
        return this.#_mode;
    }

    set #mode(mode) {
        if (!this.#allowMode.includes(mode)) return;
        this.#_mode = mode;
    }

    #init() {
        this.#addEvent();
    }

    #addEvent() {
        util.EventUtil.bindEvent(window, NMConst.eventName.POP_STATE, this.onPopState.bind(this));
    }
    
    init() {
        this.setRoute();
    }

    /* setting start */
    setOption(option) {
        const { mode = "hash" } = { ...option };
        this.#mode = mode;
    }

    setContainer(container) {
        this.#container = container;
    }
    /* setting end */

    getPathName() {
        let url;

        if (this.#mode === "hash") {
            url = location.hash.replace(/^\#*/, "");
        } else if (this.#mode === "history") {
            url = location.pathname.replace(/^\/*/, "");
        }

        url = url.replace(/\/*$/, "");

        return url;
    }

    getView(url) {
        return this.#route[url];
    }

    setRoute() {
        this.spliceRoute();
        const list = this.getPathName().split("/");

        const len = list.length;
        let now = routePath.length === 0 ? this.#container : [...routePath].pop().view;
        const startIndex = routePath.length;
        for (let idx = startIndex; idx < len; idx++) {
            try {
                const name = list[idx];
                this.setRouteView(name);
            } catch (e) {
                console.log(e);
                break;
            }
        }
        console.log(routePath);
    }

    setRouteView(name) {
        const last = [...routePath].pop();
        let { view } = { ...last };
        view = util.CommonUtil.isEmpty(view) ? this.#container : view;
        const pathName = routePath.map((r) => r.name);
        pathName.push(name);
        const url = pathName.join("/");

        try {
            let addView = this.getView(url);
            addView = new addView();
            view.append(addView);
            routePath.push({ name, view: addView });
        } catch (e) {
            console.log(e);
        }
    }

    spliceRoute() {
        if (routePath.length === 0) return;

        const pathName = this.getPathName();
        const pathNameList = pathName.split("/");
        console.log(pathName, pathNameList)
    }

    onPopState(e) {
        console.log(e);
        this.setRoute();
    }

    pushState(url, param) {
        url = `${this.#baseUrl}${url}`;
        window.history.pushState(param, "", url);
    }
}

/**
 * /기본틀/공통틀
 * /main
 * /main/body
 * /main/body/home
 * /main/body/board/list?category="blah"
 * /main/body/board/detail?oid=1
 * /main/body/statistics
 */

const router = new NMRouter();
window.rrr = router;
export default router;
