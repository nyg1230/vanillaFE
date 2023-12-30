/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const { protocol, host, port } = NMConst.env.api;
const hostUrl = `${protocol}://${host}:${port}/`;

class FetchUtil {
    static async #fetch(url, method = NMConst.method.GET, option = {}) {
        const { headers, host } = { ...option };
        delete option.headers;
        delete option.host;

        option = util.CommonUtil.shallowMerge(
            this.#options,
            option,
            {
                method,
                headers: this.#headers(headers)
            }
        );

        const requestUrl = `${host || hostUrl}${url}`;
        const request = new Request(requestUrl, option)
		let response;

        let result;
        try {
			response = await fetch(request);
            const { contentType } = option;

            let data;
            if (contentType === "text") {
                data = await response.text();
            } else {
                data = await response.json();
            }

            result = {
                data,
                state: response.ok
            }

            const token = response.headers.get(NMConst.header.token);
            token && util.store.setLocalStorage(NMConst.header.token, token);
		} catch (e) {
            result = { state: "error", msg: e };
		}

        return result;
    }

    static get #options() {
        return {
            cache: "no-cache",          // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow",         // manual, *follow, error
            referrer: "no-referrer",    // no-referrer, *client
            mode: "cors",               // no-cors, cors, *same-origin
            contentType: "json"
        };
    }

    static #headers(params) {
        const headers = new Headers({
            "Access-Control-Expose-Headers": "*",
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": "",
            ...params
        });

        return headers;
    }

    static async GET(url, data, option) {
        return await this.#fetch(url, NMConst.method.GET, option);
    }

    static async POST(url, data = {}, option = {}) {
        option.body = JSON.stringify(data);
        return await this.#fetch(url, NMConst.method.POST, option);
    }

    static async PUT(url, data, option) {
        return await this.#fetch(url, NMConst.method.PUT, option);
    }

    static async DELETE(url, data, option) {
        return await this.#fetch(url, NMConst.method.DELETE, option);
    }

    static async getIcon(path) {
        const url = `image/icon/${path}.svg`;
        const option = { host: "/", contentType: "text", headers: { "Content-type": "image/svg+xml" } };

        let icon = util.store.get("icon", path);
        
        if (!icon) {
            const result = await this.#fetch(url, NMConst.method.GET, option);
            const { data: html } = result;
            const div = util.DomUtil.createElement("div");
            div.innerHTML = html;
            const svg = util.DomUtil.querySelector(div, "svg");
            util.store.set("icon", path, svg);
            div.remove();
            icon = svg;
        }

        return icon;
    }
}


export default FetchUtil;
