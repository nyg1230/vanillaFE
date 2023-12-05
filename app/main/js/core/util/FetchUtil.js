/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

const { protocol, host, port } = NMConst.env.api;
const hostUrl = `${protocol}://${host}:${port}`;

class FetchUtil {
    static async #fetch(url, method = NMConst.method.GET, option = {}) {
        const { headers } = { ...option };
        delete option[headers]

        option = util.CommonUtil.shallowMerge(
            this.#options,
            option,
            {
                method,
                headers: this.#headers(headers),
                body: {
                    "qwer": "asdf"
                }
            }
        );

        const requestUrl = `${hostUrl}${url}`;
        const request = new Request(requestUrl, option)
		let response;

        let result;
        try {
			response = await fetch(request);
            const { contentType } = option;

            if (contentType === "text") {
                result = await response.text();
            } else {
                result = await response.json();
            }
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
            // "Content-Type": "application/json",
            ...params
        });

        return headers;
    }

    static async GET(url, option) {
        return await this.#fetch(url, NMConst.method.GET, option);
    }

    static async POST(url, option) {
        return await this.#fetch(url, NMConst.method.POST, option);
    }

    static async PUT(url, option) {
        return await this.#fetch(url, NMConst.method.PUT, option);
    }

    static async DELETE(url, option) {
        return await this.#fetch(url, NMConst.method.DELETE, option);
    }
}


export default FetchUtil;
