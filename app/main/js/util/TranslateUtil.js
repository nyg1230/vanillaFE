/* inherit */
/* common */
import * as util from "main/util/utils.js";
import language from "main/config/language/language.js";
/* component */
/* constant */
import NMConst from "main/constant/NMConstant.js";

const store = util.store;
let lang = store.getLocalStorage("language", "ko");
let pack;

const TranslateUtil = {
    translate(key, range = "common", data = []) {
        let text = util.CommonUtil.find(pack, `${range}.${key}`);

        if (util.CommonUtil.isArray(data)) {
            data.forEach((d, idx) => {
                const reg = new RegExp(`{${idx}}`);
                text = text.replace(reg, d);
            });
        }

        return text;
    },
    changeLanguage(key) {
        lang = key;
        store.setSessionStorage(key, lang);
        this.getLanguagePack(language);

        util.EventUtil.dispatchEvent(window, NMConst.eventName.CHANGE_LANGUAGE);
    },
    async getLanguagePack(key) {
        pack = language[key];
    }
};

TranslateUtil.getLanguagePack(lang);

export default TranslateUtil;
