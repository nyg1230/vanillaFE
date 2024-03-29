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
        MOUSE_UP: "mouseup",
        MOUSE_DOWN: "mousedown",
        MOUSE_PRESS: "mousepress",
        TOUCH_END: "touchend",
        TOUCH_START: "touchstart",
        TOUCH_MOVE: "touchmove",
        MODEL_CHANGE: "modelChange",
        STATE_CHANGE: "stateChange",
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
        KEY_DOWN: "keydown",
        KEY_PRESS: "keypress",
        REMOVE: "remove",
        ADD_CHILD_COMP: "addChildComponent",
        ADD_TAG: "addTag",
        REMOVE_TAG: "removeTag"
    },
    mimeType: {
        TEXT__HTML: "text/html",
        TEXT__XML: "text/xml",
        APP__XML: "application/xml",
        APP__XHTML_XML: "application/xhtml+xml",
        IMG__SVG_XML: "image/svg+xml"
    },
    param: {
        WAIT: "wait",
        NONE: "none"
    },
    method: {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE"
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
