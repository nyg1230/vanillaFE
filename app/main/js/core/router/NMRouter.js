/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
import route from "js/custom/router/route.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

/**
 * pushState로 관린하기
 * url을 /로 split한 뒤 기존 라우터 패스를 비교하여 차례대로 append 하기
 * route 계층화 고민해보기
 */
const routePath = [];
class NMRouter {
    #home = "main/body/home";
    #route = route;
    #_mode;
    #container;
    #allowMode = ["hash", "history"];
    #currentPathName;

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
        let path = this.getPathName();
        // path = util.CommonUtil.isNotEmpty(path) ? path : this.#home;
        
        if (util.CommonUtil.isNotEmpty(path)) {
            this.route({ path });
        } else {
            this.pushState(this.#home);
        }
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

    getFullPath() {
        let url;

        if (this.#mode === "hash") {
            location.hash.replace(/(?<=#).*/, (str) => {
                url = str;
            });
        } else {
            const { pathname, search } = window.location;
            url = `${pathname}${search}`;
        }

        return url;
    }

    getPathName() {
        let url = "";

        if (this.#mode === "hash") {
            location.hash.replace(/(?<=#).*?((?=\?)|(?<=$))/, (str) => {
                url = str;
            });
        } else if (this.#mode === "history") {
            url = location.pathname.replace(/^\/*/, "");
        }

        url = url.replace(/\/*$/, "");

        return url;
    }

    getPathParam() {
        let queryString = location.search;

        if (this.#mode === "hash") {
            location.hash.replace(/(?<=\?).*$/, (str) => {
                queryString = str;
            });
        } else if (this.#mode === "history") {
            queryString = location.search.replace(/^\?/, "");
        } else {
            return;
        }

        const list = queryString.split("&");
        const param = {};
        list.forEach((d) => {
            const p = d.split("=");
            const [k, v] = [...p];
            param[k] = v;
        });

        return param;
    }

    getView(url) {
        return this.#route[url];
    }

    onPopState(e) {
        const pathName = this.getPathName();

        if (this.#currentPathName === pathName) {
            const last = [...routePath].pop();
            const { view } = { ...last };
            view && view.refresh();
        } else {
            this.route({ path: pathName });
        }
    }

    pushState(url, param) {
        if (url === this.getFullPath()) return;

        if (this.#mode === "hash") {
            url = `#${url}`
        }

        window.history.pushState(param, "", url);
        this.route({ path: this.getPathName(), ...param });
    }

    route(p) {
        const { path, isPush = true, ...param } = { ...p };
        const _path = `${path}/`;

        const hasView = !!this.getView(path);
        if (!hasView) return;
        
        const list = path.split("/");
        const lastPath = list.pop();
        const len = list.length;

        let parent;

        if (!isPush) {
            const parentPath = list.join("/");
            const route = routePath.find((r) => r.path === parentPath);
            parent = route.view;
        } else {
            let startIndex = 0;
            if (routePath.length === 0) {
                parent = this.#container;
            } else {
                this.#spliceRoute(_path);
                const route = [...routePath].pop();
                const { view } = { ...route };
                parent = view;
            }

            for (let idx = routePath.length; idx < len; idx++) {
                const name = list[idx];
                const url = [...list].splice(0, idx + 1).join("/");

                const cls = this.getView(url);
                const view = new cls();
                this.#pushRoute(parent, name, view);
                parent = view;
            }
        }

        if (!this.#currentPathName || !this.#currentPathName.startsWith(_path)) {
            const name = path.split("/").pop();
            const cls = this.getView(path);
            const view = new cls(param);

            this.#pushRoute(parent, name, view);
        }

        this.#currentPathName = path;
    }

    #pushRoute(parent, name, view) {
        parent.append(view);
        routePath.push({ name, view });
    }

    #spliceRoute(url) {
        const list = url.split("/");
        const len = list.length;

        if (routePath.length === 0) return;

        let removeList;
        if (this.#currentPathName.startsWith(url)) {
            removeList = routePath.splice(len);
        } else {
            for (let idx = 0; idx < len; idx++) {
                const name = list[idx];
                const route = routePath[idx];
                
                if (!route || name !== route.name) {
                    removeList = routePath.splice(idx);
                    break;
                }
            }
        }

        if (util.CommonUtil.length(removeList) < 1) return;
        const [target] = [...removeList];
        const { view } = { ...target };
        view && view.remove();
    }

    #removeRoute(idx) {
        const removePathList = routePath.splice(idx);
        const first = removePathList.shift();
        first.destroy();
    }
}

const router = new NMRouter();
export default router;
