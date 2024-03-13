import * as util from "core/js/util/utils";
import route from "custom/js/route/route"

class Router {
    #route;
    #root;
    #path;
    #type = "hash";
    #defaultUrl = "main/body"

    constructor() {
        const { root = document.body } = { ...arguments };
        this.#root = root;
        this.#init();
    }
    
    #init() {
        this.#path = [];
        this.#type = "hash";
        this.#setEvent();
    }

    #setEvent() {
        util.EventUtil.bindEvent(window, "popstate", this.onPopstate.bind(this), {});
    }

    onPopstate(e) {
        const pathName = this.getPath();
        this.route(pathName);
    }

    route(url, state, options) {
        const { test = true } = { ...options };

        if (url) {
            if (test === false) {
                this.addRoute(url);
            } else {
                if (this.#type === "hash") url = `#${url}`;
                history.pushState(state, null, url);

                this.replaceRoute();
            }
        } else {
            this.route(this.#defaultUrl, state, options);
        }
    }

    addRoute(path) {}

    replaceRoute() {
        const path = this.getPath().split("/");
        const len = this.#path.length;
        let parent = this.#root;

        let idx;
        for (idx = 0; idx < len; idx++) {
            const { name, view } = { ...this.#path[idx] };

            if (name === path[idx]) {
                parent = view;
                continue;
            } else {
                view.remove();
                this.#path.splice(idx);
                break;
            }
        }

        if (idx !== len || len === 0) {
            const newLen = path.length;

            for (let i = idx; i < newLen; i++) {
                const name = path[i];
                const p = path.toSpliced(i + 1, Infinity).join("/");
                const component = this.getComponent(p);

                if (util.CommonUtil.isNull(component)) {
                    break;
                } else {
                    const view  = new component();
                    const info = { name, view };
                    this.#path.push(info);

                    parent.appendChild(view);
                    parent = view;
                }
            }
        }
    }

    getPath() {
        let path;

        if (this.#type === "hash") {
            // path = location.hash.replace(/(?<=(^\#\W+)).*?(?=\?)/, (str) => (path = str));
            path = location.hash.replace(/^\#/, "").replace(/(?=\?).*$/, "")
        } else {
            path = location.pathname.replace(/(?<=(^\/+)).*/, (str) => (path = str));
        }

        return path;
    }

    getComponent(path) {
        return route[path];
    }
}

const router = new Router();

export default {
    route: (...args) => router.route(...args),
    getPath: () => router.getPath()
};
