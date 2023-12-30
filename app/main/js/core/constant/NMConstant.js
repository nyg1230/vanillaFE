/* inherit */
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMCustomConstant from "js/custom/constant/NMCustomConstant.js";

const NMConstant = {
    actionName: {
        INSERT: "insert",
        UPDATE: "update",
        DELETE: "delete"
    },
    eventName: {
        CLICK: "click",
        CHANGE: "change",
        INPUT: "input",
        CHECK: "check",
        MOUSE_MOVE: "mousemove",
        MOUSE_OUT: "mouseout",
        MOUSE_OVER: "mouseover",
        MOUSE_OUT: "mouseout",
        MOUSE_ENTER: "mouseenter",
        MOUSE_LEAVE: "mouseleave",
        TOUCH_END: "touchend",
        TOUCH_START: "touchstart",
        TOUCH_MOVE: "touchmove",
        MODEL_CHANGE: "modelChange",
        CHART_COMPLETE: "chartComplete",
        POP_STATE: "popstate",
        HASH_CHANGE: "hashchange",
        CHANGE_LANGUAGE: "changeLanguage",
        SCROLL: "scroll",
        LIST_ROW_CLICK: "listRowClick",
		SCROLL_TO: "scrollTo",
        SELECT_MENU: "selectMenu",
        IMAGE_ERROR: "imageError",
        KEY_UP: "keyup",
        KEY_DOWN: "keydown"
    },
    mimeType: {
        TEXT__HTML: "text/html",
        TEXT__XML: "text/xml",
        APP__XML: "application/xml",
        APP__XHTML_XML: "application/xhtml+xml",
        IMG__SVG_XML: "image/svg+xml"

    },
    method: {
        GET: "get",
        POST: "post",
        PUT: "put",
        DELETE: "delete"
    },
    header: {
        token: "X-AUTH-TOKEN"
    },
    env: {
        baseUrl: "",
        api: {
            protocol: "http",
            host: "127.0.0.1",
            port: "5000"
        },
        github: {
            apiVersion: "2022-11-28"
        }
    }
};

util.CommonUtil.deepMerge(NMConstant, NMCustomConstant);

export default NMConstant;
