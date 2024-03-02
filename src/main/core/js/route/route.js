import routes from "custom/js/component/route/route";

class route {
    #view;

    constructor() {
        this.#view = {};
    }

    getView(path) {
        return this.#view[path];
    }

    setView(obj) {
        Object.entries(obj).forEach(([k, v]) => {
            this.#view[k] = v;
        });
    }
}

const route = new route();
route.setView(routes);

export default route;
