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
    static async #fetch(url, method = NMConst.method.GET, option) {
        option = util.CommonUtil.shallowMerge(this.#header, option);
        option.method = method;
        const requestUrl = `${hostUrl}${url}`;
        const request = new Request({}, option)
		let response;
		try {
			response = await fetch(requestUrl, request);
		} catch (e) {
			console.log(e);
		}
        return response;
    }

    static get #header() {
        return {
            mode: "cors"
        }
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
