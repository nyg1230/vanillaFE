/* inherit */
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

const FetchUtil = {
    async fetch(url, method = NMConst.method.GET, option) {
        const baseOption = {};
        option = util.CommonUtil.shallowMerge(baseOption, option);
        option.method = method;
        const request = new Request(url, option)
        const response = await fetch(request);
        console.log(response);
        return response;
    },
    async GET(url, option) {
        return await this.fetch(url, NMConst.method.GET, option);
    },
    async POST(url, option) {
        return await this.fetch(url, NMConst.method.POST, option);
    },
    async PUT(url, option) {
        return await this.fetch(url, NMConst.method.PUT, option);
    },
    async DELETE(url, option) {
        return await this.fetch(url, NMConst.method.DELETE, option);
    }
};

export default FetchUtil;
