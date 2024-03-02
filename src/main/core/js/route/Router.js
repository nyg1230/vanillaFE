import * as util from "core/js/util/utils";
import route from "custom/js/route/route"

class Router {
    #root = document.body;
    #path;
    #type = "hash";

    constructor() {
        this.#init();
    }
    
    #init() {
        this.#path = [];
        this.#type = "hash";
        this.#setEvent();
    }

    #setEvent() {
        util.EventUtil.bindEvent(window, "popstate", this.onPopstate, {});
    }

    onPopstate(e) {
        console.log(e);
    }

    route(url, state, options) {
        const { test = true } = { ...options };

        if (test === false) {
            this.addRoute(url);
        } else {
            this.replaceRoute();
            
            if (this.#type === "hash") {
                url = `#${url}`
            }
            history.pushState(state, null, url);
        }
    }

    addRoute(path) {}

    replaceRoute() {
        const path = this.getPath().split("/");
        const len = this.#path.length;
        let parent = this.#root;

        idx;
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

        if (idx !== len) {
            const newLen = path.length;

            for (let i = idx; i < newLen; i++) {
                const name = path[i];
                const p = path.toSpliced(0, i).join("/");
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
            location.hash.replace(/(?<=(^\#\W+)).*?(?=\?)/, (str) => (path = str));
        } else {
            path = location.pathname.replace(/(?<=(^\/+)).*/, (str) => (path = str));
        }

        return path;
    }

    getComponent(path) {
        return route.getView(path);
    }
}

const router = new Router();

export default {
    route: (...args) => router.route(...args)
};
