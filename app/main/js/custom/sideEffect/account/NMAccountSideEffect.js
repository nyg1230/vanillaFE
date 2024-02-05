/* inherit */
import NMSideEffect from "js/core/sideEffect/NMSideEffect";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
import NMAccountModel from "js/custom/model/account/NMAccountModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class NMAccountSideEffect extends NMSideEffect {
    static get url() {
        return {
            ADD: "account/add",
            GET: "account/get",
            UPDATE: "account/update",
            ADD_TAG: "tag/add",
            REMOVE_TAG: "tag/remove",
            PERIOD_DATA: "account/period/data",
            PERIOD_CATEGORY_DATA: "account/period/category/data"
        };
    }
    
    async addList(list) {
        const result = await this.api(NMAccountSideEffect.url.ADD, NMConst.method.POST, { list }, { contentType: NMConst.param.NONE });
        NMAccountModel.setState("addList", result);
    }

    async getList(param) {
        const result = await this.api(NMAccountSideEffect.url.GET, NMConst.method.POST, { ...param }, {});
        NMAccountModel.set("list", result);
    }

    async update(oid, param) {
        const result = await this.api(NMAccountSideEffect.url.UPDATE, NMConst.method.POST, { oid, ...param }, { contentType: NMConst.param.NONE });
        console.log(param);
        console.log(result);
    }

    async addTag(param) {
        const result = await this.api(NMAccountSideEffect.url.ADD_TAG, NMConst.method.POST, { ...param });
        const { data, state } = { ...result };

        if (state) {
            util.CommonUtil.deepMerge(param, data);
        }

        NMAccountModel.setState("addTag", result);
    }

    async removeTag(oid) {
        const result = await this.api(NMAccountSideEffect.url.REMOVE_TAG, NMConst.method.POST, { oid }, { contentType: NMConst.param.NONE });
        NMAccountModel.setState("removeTag", result);
    }

    async getPeriodData(param) {
        const result = await this.api(NMAccountSideEffect.url.PERIOD_DATA, NMConst.method.POST, { ...param });
        NMAccountModel.set("periodData", result);
    }

    async getPeriodCategoryData(param) {
        const result = await this.api(NMAccountSideEffect.url.PERIOD_CATEGORY_DATA, NMConst.method.POST, { ...param });
        NMAccountModel.set("periodCategoryData", result);
    }
}

const accountSideEffect = new NMAccountSideEffect();

export default accountSideEffect;
