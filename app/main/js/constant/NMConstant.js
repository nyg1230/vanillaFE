const NMConstant = {
    eventName: {
        CLICK: "click",
        MOUSE_MOVE: "mousemove",
        MOUSE_OUT: "mouseout",
        MOUSE_OVER: "mouseover",
        MOUSE_OUT: "mouseout",
        MOUSE_ENTER: "mouseenter",
        MOUSE_LEAVE: "mouseleave",
        MODEL_CHANGE: "modelChange",
        CHART_COMPLETE: "chartComplete",
        POP_STATE: "popstate",
        HASH_CHANGE: "hashchange",
        CHANGE_LANGUAGE: "changeLanguage"
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
    env: {
        baseUrl: "",
        github: {
            apiVersion: "2022-11-28"
        }
    }
}

export default NMConstant;
