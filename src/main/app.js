import elements from "core/js/customElement/element/elements";
import router from "core/js/route/Router";


window.onload = (e) => {
    const body = document.querySelector("body");
    router.route(router.getPath());
}
